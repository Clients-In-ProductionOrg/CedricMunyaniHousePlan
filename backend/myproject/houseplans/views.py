from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import requests
from datetime import datetime
from .models import HousePlan, HousePlanImage, Floor, Room, Feature, Amenity, QuoteRequest, ContactMessage, Purchase, SiteSettings
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
        
        purchase = Purchase.objects.create(
            house_plan=house_plan,
            plan_price=house_plan.price,
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone_number=data.get('phone_number'),
            province=data.get('province'),
            city=data.get('city'),
            pick_up_point=data.get('pick_up_point', ''),
            area_mall=data.get('area_mall', ''),
            payment_status='pending'
        )
        return Response({
            'success': True,
            'message': 'Purchase created successfully',
            'id': purchase.id,
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


@api_view(['POST'])
def process_payment(request):
    """Process payment through Yoco"""
    try:
        data = request.data
        purchase_id = data.get('purchase_id')
        token = data.get('token')
        
        # Get the purchase
        purchase = Purchase.objects.get(pk=purchase_id)
        
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
