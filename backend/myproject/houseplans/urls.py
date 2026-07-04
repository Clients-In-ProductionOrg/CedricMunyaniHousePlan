from django.urls import path
from . import views

urlpatterns = [
    # House Plans API
    path('api/house-plans/', views.house_plans_list, name='house_plans_list'),
    path('api/house-plans/<int:pk>/', views.house_plan_detail, name='house_plan_detail'),
    path('api/house-plans/<int:pk>/download-images/', views.download_house_plan_images, name='download_house_plan_images'),
    path('api/built-homes/', views.built_homes, name='built_homes'),
    
    # Contact APIs
    path('api/quote-request/', views.create_quote_request, name='create_quote_request'),
    path('api/contact-message/', views.create_contact_message, name='create_contact_message'),
    path('api/purchase/', views.create_purchase, name='create_purchase'),
    path('api/purchase/<str:purchase_id>/sync/', views.sync_purchase_status, name='sync_purchase_status'),
    path('api/purchase/<str:purchase_id>/receipt-link/', views.purchase_receipt_link, name='purchase_receipt_link'),
    path('api/purchase/receipt-lookup/', views.purchase_receipt_lookup, name='purchase_receipt_lookup'),
    path('api/purchase/phone-summary/', views.purchase_phone_summary, name='purchase_phone_summary'),
    path('api/purchase/<str:purchase_id>/receipt/', views.purchase_receipt, name='purchase_receipt'),
    path('api/purchase/<str:purchase_id>/admin-plan/', views.purchase_admin_plan, name='purchase_admin_plan'),
    path('api/purchase/<str:purchase_id>/summary/', views.purchase_summary, name='purchase_summary'),
    path('api/purchase/<str:purchase_id>/success/', views.purchase_success, name='purchase_success'),
    path('api/purchase/<str:purchase_id>/cancel/', views.purchase_cancel, name='purchase_cancel'),
    path('api/purchase/<str:purchase_id>/failure/', views.purchase_failure, name='purchase_failure'),
    
    # Payment API
    path('api/process-payment/', views.process_payment, name='process_payment'),
    path('api/yoco-public-key/', views.get_yoco_public_key, name='get_yoco_public_key'),
    path('api/create-checkout/', views.create_checkout, name='create_checkout'),
    path('api/yoco/webhook/', views.yoco_webhook, name='yoco_webhook'),
    
    # Site Settings API
    path('api/site-settings/', views.get_site_settings, name='get_site_settings'),
]
