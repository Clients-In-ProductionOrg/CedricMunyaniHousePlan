from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from urllib.parse import quote
import hashlib
import hmac
import logging
import time
import io
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
import requests
from datetime import datetime
from .models import HousePlan, HousePlanImage, Floor, Room, Feature, Amenity, QuoteRequest, ContactMessage, Purchase, SiteSettings

logger = logging.getLogger(__name__)
from .serializers import (
    HousePlanDetailSerializer, 
    HousePlanListSerializer,
    HousePlanImageSerializer,
    FloorSerializer,
    RoomSerializer,
    FeatureSerializer,
    AmenitySerializer,
    SiteSettingsSerializer
)

@api_view(['GET'])
def house_plans_list(request):
    """Get all house plans"""
    display_location = request.query_params.get('display_on', None)
    
    plans = HousePlan.objects.all()
    if display_location:
        plans = plans.filter(display_location=display_location)
    
    serializer = HousePlanListSerializer(plans, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def house_plan_detail(request, pk):
    """Get detailed information about a specific house plan"""
    try:
        plan = HousePlan.objects.get(pk=pk)
        serializer = HousePlanDetailSerializer(plan)
        return Response(serializer.data)
    except HousePlan.DoesNotExist:
        return Response({'error': 'House plan not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def built_homes(request):
    """Get all built homes (house plans with display_location='built_plans_page')"""
    plans = HousePlan.objects.filter(display_location='built_plans_page')
    serializer = HousePlanListSerializer(plans, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_quote_request(request):
    """Create a new quote request"""
    try:
        data = request.data
        quote = QuoteRequest.objects.create(
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone_number=data.get('phone_number'),
            city=data.get('city'),
            preferred_style=data.get('preferred_style'),
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            other_required_rooms=data.get('other_required_rooms', ''),
            stand_length_meters=data.get('stand_length_meters'),
            stand_breadth_meters=data.get('stand_breadth_meters'),
            budget=data.get('budget'),
            project_description=data.get('project_description', '')
        )
        return Response({
            'success': True,
            'message': 'Quote request created successfully',
            'id': quote.id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_contact_message(request):
    """Create a new contact message"""
    try:
        data = request.data
        message = ContactMessage.objects.create(
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone_number=data.get('phone_number'),
            subject=data.get('subject'),
            message=data.get('message')
        )
        return Response({
            'success': True,
            'message': 'Contact message sent successfully',
            'id': message.id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_purchase(request):
    """Create a new purchase"""
    try:
        data = request.data
        house_plan = HousePlan.objects.get(pk=data.get('house_plan_id'))
        secret_password = (data.get('secret_password') or '').strip()
        if not secret_password:
            return Response({
                'success': False,
                'error': 'Secret password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        phone_number = _normalize_phone_number(data.get('phone_number') or '')
        if len(phone_number) != 10:
            return Response({
                'success': False,
                'error': 'Phone number must be exactly 10 digits. Please check for missing or extra digits.'
            }, status=status.HTTP_400_BAD_REQUEST)

        existing_purchases = Purchase.objects.filter(phone_number=phone_number)
        for existing_purchase in existing_purchases:
            if existing_purchase.secret_password_hash and check_password(secret_password, existing_purchase.secret_password_hash):
                return Response({
                    'success': False,
                    'error': 'This secret password has already been used for a previous purchase. Please choose a different secret password.'
                }, status=status.HTTP_400_BAD_REQUEST)

        purchase = Purchase.objects.create(
            house_plan=house_plan,
            plan_price=house_plan.price,
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone_number=phone_number,
            province=data.get('province'),
            city=data.get('city'),
            pick_up_point=data.get('pick_up_point', ''),
            area_mall=data.get('area_mall', ''),
            secret_password_hash=make_password(secret_password),
            payment_status='pending'
        )
        return Response({
            'success': True,
            'message': 'Purchase created successfully',
            'id': purchase.id,
            'public_id': purchase.public_id,
            'price': str(house_plan.price)
        }, status=status.HTTP_201_CREATED)
    except HousePlan.DoesNotExist:
        return Response({
            'success': False,
            'error': 'House plan not found'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_site_settings(request):
    """Get site settings"""
    try:
        site_settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(site_settings)
        return Response(serializer.data)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_yoco_public_key(request):
    """Get Yoco public key for frontend"""
    return Response({
        'public_key': settings.YOCO_PUBLIC_KEY
    })


def _sync_purchase_with_yoco(purchase: Purchase) -> Purchase:
    if not purchase.yoco_checkout_id:
        return purchase

    yoco_url = f"https://payments.yoco.com/api/checkouts/{purchase.yoco_checkout_id}"
    headers = {
        'Authorization': f'Bearer {settings.YOCO_SECRET_KEY}',
        'Content-Type': 'application/json'
    }

    response = requests.get(yoco_url, headers=headers)
    if response.status_code != 200:
        return purchase

    response_data = response.json()
    status_value = (
        response_data.get('status')
        or response_data.get('state')
        or response_data.get('statusCode')
        or ''
    ).lower()

    terminal_statuses = {'cancelled', 'failed', 'completed'}
    success_statuses = {'succeeded', 'successful', 'completed', 'paid'}

    if not status_value:
        return purchase

    if purchase.payment_status in terminal_statuses and status_value not in success_statuses:
        return purchase

    if status_value in success_statuses:
        purchase.payment_status = 'completed'
        purchase.yoco_payment_id = (
            response_data.get('payment_id')
            or response_data.get('paymentId')
            or purchase.yoco_payment_id
        )
        purchase.payment_date = purchase.payment_date or timezone.now()
    elif status_value in {'cancelled', 'canceled'}:
        purchase.payment_status = 'cancelled'
    elif status_value == 'failed':
        purchase.payment_status = 'failed'
    elif status_value == 'pending' and purchase.payment_status in {'cancelled', 'failed', 'completed'}:
        return purchase
    else:
        purchase.payment_status = 'pending'

    purchase.save(update_fields=['payment_status', 'yoco_payment_id', 'payment_date', 'updated_at'])
    return purchase


def _extract_checkout_id(payload: dict) -> str:
    candidates = [
        payload.get('checkout_id'),
        payload.get('checkoutId'),
        payload.get('id'),
    ]

    data = payload.get('data') if isinstance(payload.get('data'), dict) else {}
    candidates.extend([
        data.get('checkout_id'),
        data.get('checkoutId'),
        data.get('id'),
    ])

    for value in candidates:
        if value:
            return str(value)
    return ''


def _extract_event_status(payload: dict) -> str:
    candidates = [
        payload.get('status'),
        payload.get('state'),
        payload.get('statusCode'),
    ]

    data = payload.get('data') if isinstance(payload.get('data'), dict) else {}
    candidates.extend([
        data.get('status'),
        data.get('state'),
        data.get('statusCode'),
    ])

    for value in candidates:
        if value:
            return str(value).lower()
    return ''


def _get_return_url(request) -> str:
    return_url = request.query_params.get('return_url')
    if return_url:
        return return_url
    return settings.FRONTEND_URL


def _get_frontend_base(request) -> str:
    configured = getattr(settings, 'FRONTEND_URL', None)
    if configured:
        return configured.rstrip('/')
    origin = request.headers.get('Origin')
    if origin:
        return origin.rstrip('/')
    return request.build_absolute_uri('/').rstrip('/')


def _normalize_phone_number(phone: str) -> str:
    return ''.join(char for char in str(phone) if char.isdigit())


def _build_signature(purchase_id: str, action: str, return_url: str, expires: int) -> str:
    secret = settings.SECRET_KEY.encode('utf-8')
    message = f"{purchase_id}:{action}:{expires}:{return_url}".encode('utf-8')
    return hmac.new(secret, message, hashlib.sha256).hexdigest()


def _build_signed_redirect_url(request, purchase_id: str, action: str, return_url: str) -> str:
    backend_base = request.build_absolute_uri('/').rstrip('/')
    expires = int(time.time()) + (2 * 60 * 60)
    signature = _build_signature(purchase_id, action, return_url, expires)
    encoded_return_url = quote(return_url, safe='')
    return (
        f"{backend_base}/api/purchase/{purchase_id}/{action}/"
        f"?return_url={encoded_return_url}&expires={expires}&sig={signature}"
    )


def _build_signed_receipt_url(request, purchase_id: str, return_url: str) -> str:
    backend_base = request.build_absolute_uri('/').rstrip('/')
    expires = int(time.time()) + (2 * 60 * 60)
    signature = _build_signature(purchase_id, 'receipt', return_url, expires)
    encoded_return_url = quote(return_url, safe='')
    return (
        f"{backend_base}/api/purchase/{purchase_id}/receipt/"
        f"?return_url={encoded_return_url}&expires={expires}&sig={signature}"
    )


def _validate_signature(request, purchase_id: str, action: str) -> bool:
    return_url = request.query_params.get('return_url', '')
    expires = request.query_params.get('expires', '')
    signature = request.query_params.get('sig', '')

    if not (return_url and expires and signature):
        return False

    try:
        expires_value = int(expires)
    except ValueError:
        return False

    if expires_value < int(time.time()):
        return False

    expected = _build_signature(purchase_id, action, return_url, expires_value)
    return hmac.compare_digest(expected, signature)


def _build_receipt_pdf(purchase: Purchase, frontend_base: str) -> bytes:
    buffer = io.BytesIO()
    site_settings = SiteSettings.get_settings()
    
    # Create the PDF object, using the buffer as its "file."
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
        title=f"Receipt-{purchase.public_id}"
    )

    # Styles
    styles = getSampleStyleSheet()
    
    # Custom colors
    TEAL = colors.HexColor("#00B4D8")
    DARK_GREY = colors.HexColor("#333333")
    LIGHT_GREY = colors.HexColor("#F5F5F5")
    
    # Custom Styles
    styles.add(ParagraphStyle(name='HeaderTitle', parent=styles['Heading1'], fontSize=24, textColor=TEAL, spaceAfter=20))
    styles.add(ParagraphStyle(name='SectionTitle', parent=styles['Heading3'], fontSize=12, textColor=DARK_GREY, spaceAfter=5))
    styles.add(ParagraphStyle(name='NormalSmall', parent=styles['Normal'], fontSize=10, textColor=DARK_GREY, leading=14))
    styles.add(ParagraphStyle(name='TableText', parent=styles['Normal'], fontSize=10, textColor=DARK_GREY))
    styles.add(ParagraphStyle(name='FooterText', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER))

    elements = []

    # --- Header Section ---
    # Title
    elements.append(Paragraph("PAYMENT RECEIPT", styles['HeaderTitle']))
    
    # Line
    line_data = [[""]]
    line_table = Table(line_data, colWidths=[7.5*inch])
    line_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 2, TEAL),
    ]))
    elements.append(line_table)
    elements.append(Spacer(1, 20))

    # --- Info Section (Company and Order Info) ---
    company_name = site_settings.company_name or "Cedric House Plans"
    address_text = (site_settings.address or "").strip()
    address_text = address_text.replace("\n", "<br/>") if address_text else ""
    company_lines = [f"<b>{company_name}</b>"]
    if address_text:
        company_lines.append(address_text)
    if site_settings.phone:
        company_lines.append(site_settings.phone)
    if site_settings.email:
        company_lines.append(site_settings.email)
    company_info_text = "<br/>".join(company_lines)
    
    payment_date = purchase.payment_date or purchase.created_at
    formatted_date = payment_date.strftime("%d %B %Y")
    
    order_info_text = f"""
    <b>Receipt ID:</b> {purchase.public_id}<br/>
    <b>Date:</b> {formatted_date}<br/>
    <b>Status:</b> {str(purchase.payment_status).title()}
    """
    
    info_data = [[
        Paragraph(company_info_text, styles['NormalSmall']),
        Paragraph(order_info_text, styles['NormalSmall'])
    ]]
    
    info_table = Table(info_data, colWidths=[4*inch, 3.5*inch])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'), # Align order info to right
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 30))
    
    # --- Customer Section ---
    province_display = purchase.get_province_display() if purchase.province else ""
    customer_info_text = (
        f"<b>Bill To:</b><br/>"
        f"{purchase.full_name}<br/>"
        f"{purchase.email}<br/>"
        f"{purchase.phone_number}"
    )
    if province_display:
        customer_info_text += f"<br/>Province: {province_display}"
    if purchase.pick_up_point:
        customer_info_text += f"<br/>Pickup: {purchase.pick_up_point}"
    if purchase.area_mall:
        customer_info_text += f" ({purchase.area_mall})"

    elements.append(Paragraph(customer_info_text, styles['NormalSmall']))
    elements.append(Spacer(1, 20))

    # --- Items Table ---
    # Header
    table_headers = ["Item Description", "Type", "Price"]
    
    # Data Row
    house_plan = purchase.house_plan
    plan_url = f"{frontend_base}/house-details/{house_plan.id}"
    
    # Use standard text for description, ReportLab <a> tags can be finicky depending on version/context.
    # We will put the link below the description or inline.
    description_text = f"<b>{house_plan.title}</b><br/>Design #{house_plan.id}"
    
    item_row = [
        Paragraph(description_text, styles['TableText']),
        "Digital Download",
        f"R {purchase.plan_price}"
    ]
    
    table_data = [table_headers, item_row]
    
    # Table Style
    t = Table(table_data, colWidths=[4.5*inch, 1.5*inch, 1.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), LIGHT_GREY),
        ('TEXTCOLOR', (0, 0), (-1, 0), TEAL),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'), # Price right align
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('LINEBELOW', (0, 0), (-1, 0), 1, TEAL),
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    
    # --- Totals ---
    total_data = [
        ["Total", f"R {purchase.plan_price}"]
    ]
    total_table = Table(total_data, colWidths=[6*inch, 1.5*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (-1, -1), TEAL),
        ('SIZE', (0, 0), (-1, -1), 12),
    ]))
    elements.append(total_table)
    
    # --- Link to Plan ---
    elements.append(Spacer(1, 20))
    link_paragraph = Paragraph(
        f'Access your house plan here: <a href="{plan_url}" color="#00B4D8"><u>{plan_url}</u></a>',
        styles['NormalSmall']
    )
    elements.append(link_paragraph)
    
    # --- Footer ---
    elements.append(Spacer(1, 50))
    delivery_notice = (
        "<b>Delivery Notice</b><br/>"
        "Please note that the purchased house plan will be delivered within less than 5 working days.<br/><br/>"
        "For more information or assistance, please contact us on:<br/>"
        "069 588 5837 / 072 665 9790<br/><br/>"
        "You may also reach us on Facebook:<br/>"
        "<a href=\"https://web.facebook.com/MPHOCEDRICHOUSEPLANS?_rdc=1&_rdr#\" color=\"#00B4D8\">"
        "<u>MPHO CEDRIC HOUSE PLANS</u></a>"
    )
    elements.append(Paragraph(delivery_notice, styles['FooterText']))

    # Build PDF
    doc.build(elements)
    
    buffer.seek(0)
    return buffer.read()


def _get_purchase_by_identifier(purchase_id: str) -> Purchase:
    purchase_id = str(purchase_id).strip()
    if purchase_id.isdigit():
        purchase = Purchase.objects.filter(pk=int(purchase_id)).first()
        if purchase:
            return purchase
    return get_object_or_404(Purchase, public_id=purchase_id)


def _update_status_and_redirect(purchase: Purchase, status_value: str, request):
    if status_value in {'succeeded', 'successful', 'completed', 'paid'}:
        purchase.payment_status = 'completed'
        purchase.payment_date = purchase.payment_date or timezone.now()
    elif status_value in {'cancelled', 'canceled'}:
        purchase.payment_status = 'cancelled'
    elif status_value == 'failed':
        purchase.payment_status = 'failed'
    else:
        purchase.payment_status = 'pending'

    purchase.save(update_fields=['payment_status', 'payment_date', 'updated_at'])
    return redirect(_get_return_url(request))


@api_view(['GET'])
def purchase_summary(request, purchase_id: str):
    """Return purchase summary details for WhatsApp message"""
    purchase = _get_purchase_by_identifier(purchase_id)
    frontend_base = _get_frontend_base(request)
    payment_date = purchase.payment_date or purchase.created_at

    data = {
        'receipt_id': purchase.public_id,
        'date': payment_date.strftime('%d %B %Y'),
        'status': purchase.get_payment_status_display(),
        'full_name': purchase.full_name,
        'email': purchase.email,
        'phone_number': purchase.phone_number,
        'province': purchase.get_province_display() if purchase.province else '',
        'pick_up_point': purchase.pick_up_point or '',
        'area_mall': purchase.area_mall or '',
        'plan_title': purchase.house_plan.title,
        'plan_id': purchase.house_plan.id,
        'plan_price': str(purchase.plan_price),
        'plan_type': 'Digital Download',
        'plan_url': f"{frontend_base}/house-details/{purchase.house_plan.id}",
    }
    return Response(data)


@api_view(['POST'])
def create_checkout(request):
    """Create a Yoco Checkout session and return redirect URL"""
    try:
        data = request.data
        purchase_id = data.get('purchase_id')

        purchase = _get_purchase_by_identifier(purchase_id)

        backend_base = request.build_absolute_uri('/').rstrip('/')
        frontend_base = getattr(settings, 'FRONTEND_URL', None) or request.headers.get('Origin') or backend_base

        success_return_url = f"{frontend_base}/house-plans?checkout=success&purchase_id={purchase.public_id}"
        cancel_return_url = f"{frontend_base}/house-plans?checkout=cancel&purchase_id={purchase.public_id}"
        failure_return_url = f"{frontend_base}/house-plans?checkout=failure&purchase_id={purchase.public_id}"

        success_url = _build_signed_redirect_url(request, purchase.public_id, 'success', success_return_url)
        cancel_url = _build_signed_redirect_url(request, purchase.public_id, 'cancel', cancel_return_url)
        failure_url = _build_signed_redirect_url(request, purchase.public_id, 'failure', failure_return_url)

        yoco_url = 'https://payments.yoco.com/api/checkouts'
        headers = {
            'Authorization': f'Bearer {settings.YOCO_SECRET_KEY}',
            'Content-Type': 'application/json'
        }

        amount_cents = int(float(purchase.plan_price) * 100)

        payload = {
            'amount': amount_cents,
            'currency': 'ZAR',
            'successUrl': success_url,
            'cancelUrl': cancel_url,
            'failureUrl': failure_url,
            'metadata': {
                'purchase_id': purchase.id,
                'purchase_public_id': purchase.public_id,
                'customer_name': purchase.full_name,
                'customer_email': purchase.email,
                'plan_name': purchase.house_plan.title
            },
            'clientReferenceId': str(purchase.public_id)
        }

        response = requests.post(yoco_url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code in (200, 201):
            checkout_id = response_data.get('id')
            purchase.yoco_reference = checkout_id
            purchase.yoco_checkout_id = checkout_id
            purchase.payment_status = 'pending'
            purchase.save(update_fields=['yoco_reference', 'yoco_checkout_id', 'payment_status', 'updated_at'])

            return Response({
                'success': True,
                'redirect_url': response_data.get('redirectUrl'),
                'checkout_id': response_data.get('id')
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'error': response_data
        }, status=status.HTTP_400_BAD_REQUEST)

    except Purchase.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Purchase not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def sync_purchase_status(request, purchase_id):
    """Sync payment status from Yoco Checkout"""
    purchase = _get_purchase_by_identifier(purchase_id)
    purchase = _sync_purchase_with_yoco(purchase)
    return Response({
        'payment_status': purchase.payment_status
    })


@api_view(['GET'])
def purchase_receipt_link(request, purchase_id):
    purchase = _get_purchase_by_identifier(purchase_id)
    if purchase.payment_status != 'completed':
        return Response({'detail': 'Receipt available after payment completion.'}, status=status.HTTP_403_FORBIDDEN)

    frontend_base = _get_frontend_base(request)
    return_url = f"{frontend_base}/house-plans?receipt=ready&purchase_id={purchase.public_id}"
    url = _build_signed_receipt_url(request, purchase.public_id, return_url)
    return Response({'url': url})


@api_view(['POST'])
def purchase_receipt_lookup(request):
    data = request.data if isinstance(request.data, dict) else {}
    phone_number = _normalize_phone_number(data.get('phone_number') or data.get('phone') or '')
    secret_password = (data.get('secret_password') or '').strip()
    return_path = (data.get('return_path') or '').strip()

    if not phone_number or not secret_password:
        return Response({'detail': 'Phone number and secret password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(phone_number) != 10:
        return Response({'detail': 'Phone number must be exactly 10 digits. Please check for missing or extra digits.'}, status=status.HTTP_400_BAD_REQUEST)

    purchases = Purchase.objects.filter(phone_number=phone_number).order_by('-created_at')
    for purchase in purchases:
        if not purchase.secret_password_hash:
            continue
        if check_password(secret_password, purchase.secret_password_hash):
            if purchase.payment_status != 'completed':
                return Response({'detail': 'Payment not completed. Please complete your purchase to download the receipt.'}, status=status.HTTP_403_FORBIDDEN)

            frontend_base = _get_frontend_base(request)
            safe_path = return_path if return_path.startswith('/') else '/house-plans'
            return_url = f"{frontend_base}{safe_path}"
            url = _build_signed_receipt_url(request, purchase.public_id, return_url)
            return Response({'url': url, 'purchase_id': purchase.public_id})

    return Response({'detail': 'No matching purchase found. Please complete a house plan purchase first.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def purchase_receipt(request, purchase_id):
    if not _validate_signature(request, purchase_id, 'receipt'):
        return Response({'detail': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)

    purchase = _get_purchase_by_identifier(purchase_id)
    if purchase.payment_status != 'completed':
        return Response({'detail': 'Receipt available after payment completion.'}, status=status.HTTP_403_FORBIDDEN)

    frontend_base = _get_frontend_base(request)
    pdf_bytes = _build_receipt_pdf(purchase, frontend_base)

    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="receipt-{purchase.public_id}.pdf"'
    return response


@api_view(['POST'])
def yoco_webhook(request):
    """Receive Yoco webhook events and update purchase status."""
    payload = request.data if isinstance(request.data, dict) else {}
    checkout_id = _extract_checkout_id(payload)

    if not checkout_id:
        return Response({'received': True})

    purchase = Purchase.objects.filter(yoco_checkout_id=checkout_id).first()
    if not purchase:
        return Response({'received': True})

    event_status = _extract_event_status(payload)
    if event_status:
        if event_status in {'succeeded', 'successful', 'completed', 'paid'}:
            purchase.payment_status = 'completed'
            purchase.payment_date = purchase.payment_date or timezone.now()
        elif event_status in {'cancelled', 'canceled'}:
            purchase.payment_status = 'cancelled'
        elif event_status == 'failed':
            purchase.payment_status = 'failed'

        purchase.save(update_fields=['payment_status', 'payment_date', 'updated_at'])
        return Response({'received': True})

    _sync_purchase_with_yoco(purchase)
    return Response({'received': True})


@api_view(['GET'])
def purchase_success(request, purchase_id):
    """Handle success redirects from Yoco checkout."""
    if not _validate_signature(request, purchase_id, 'success'):
        return Response({'detail': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
    purchase = _get_purchase_by_identifier(purchase_id)
    _sync_purchase_with_yoco(purchase)
    if purchase.payment_status == 'completed':
        return redirect(_get_return_url(request))
    return _update_status_and_redirect(purchase, 'completed', request)


@api_view(['GET'])
def purchase_cancel(request, purchase_id):
    """Handle cancel redirects from Yoco checkout."""
    if not _validate_signature(request, purchase_id, 'cancel'):
        return Response({'detail': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
    purchase = _get_purchase_by_identifier(purchase_id)
    logger.info("Yoco cancel redirect received", extra={"purchase_id": purchase_id, "current_status": purchase.payment_status})
    return _update_status_and_redirect(purchase, 'cancelled', request)


@api_view(['GET'])
def purchase_failure(request, purchase_id):
    """Handle failure redirects from Yoco checkout."""
    if not _validate_signature(request, purchase_id, 'failure'):
        return Response({'detail': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
    purchase = _get_purchase_by_identifier(purchase_id)
    return _update_status_and_redirect(purchase, 'failed', request)


@api_view(['POST'])
def process_payment(request):
    """Process payment through Yoco"""
    try:
        data = request.data
        purchase_id = data.get('purchase_id')
        token = data.get('token')
        
        # Get the purchase
        purchase = _get_purchase_by_identifier(purchase_id)
        
        if not token:
            return Response({
                'success': False,
                'error': 'Payment token required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare Yoco payment request
        yoco_url = 'https://api.yoco.com/v1/charges'
        headers = {
            'Authorization': f'Bearer {settings.YOCO_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Amount in cents (Yoco expects amount in cents)
        amount_cents = int(float(purchase.plan_price) * 100)
        
        payload = {
            'token': token,
            'amount': amount_cents,
            'currency': 'ZAR',
            'metadata': {
                'purchase_id': purchase.id,
                'customer_name': purchase.full_name,
                'customer_email': purchase.email,
                'plan_name': purchase.house_plan.title
            }
        }
        
        # Make request to Yoco
        response = requests.post(yoco_url, json=payload, headers=headers)
        response_data = response.json()
        
        if response.status_code == 201:
            # Payment successful
            purchase.payment_status = 'completed'
            purchase.payment_date = datetime.now()
            purchase.yoco_reference = response_data.get('id')
            purchase.yoco_token = token
            purchase.save()
            
            return Response({
                'success': True,
                'message': 'Payment processed successfully',
                'reference': response_data.get('id'),
                'purchase_id': purchase.id
            }, status=status.HTTP_200_OK)
        else:
            # Payment failed
            purchase.payment_status = 'failed'
            purchase.save()
            
            error_message = response_data.get('message', 'Payment processing failed')
            return Response({
                'success': False,
                'error': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Purchase.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Purchase not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
