from django.urls import path
from . import views

urlpatterns = [
    # House Plans API
    path('api/house-plans/', views.house_plans_list, name='house_plans_list'),
    path('api/house-plans/<int:pk>/', views.house_plan_detail, name='house_plan_detail'),
    path('api/built-homes/', views.built_homes, name='built_homes'),
    
    # Contact APIs
    path('api/quote-request/', views.create_quote_request, name='create_quote_request'),
    path('api/contact-message/', views.create_contact_message, name='create_contact_message'),
    path('api/purchase/', views.create_purchase, name='create_purchase'),
    
    # Payment API
    path('api/process-payment/', views.process_payment, name='process_payment'),
    path('api/yoco-public-key/', views.get_yoco_public_key, name='get_yoco_public_key'),
    
    # Site Settings API
    path('api/site-settings/', views.get_site_settings, name='get_site_settings'),
]
