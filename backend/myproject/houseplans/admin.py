from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from .models import HousePlan, HousePlanImage, Floor, Feature, Amenity, Room, QuoteRequest, ContactMessage, SiteSettings, Purchase


class RoomInline(admin.TabularInline):
    model = Room
    extra = 1
    fields = ('name', 'quantity', 'description', 'order')


class HousePlanImageInline(admin.TabularInline):
    model = HousePlanImage
    extra = 1
    fields = ('image', 'title', 'order')


class FloorInline(admin.TabularInline):
    model = Floor
    extra = 1
    fields = ('level', 'floor_area', 'bedrooms', 'bathrooms', 'lounges', 'dining_areas', 'notes', 'order')


class FeatureInline(admin.TabularInline):
    model = Feature
    extra = 1
    fields = ('name', 'description', 'order')


class AmenityInline(admin.TabularInline):
    model = Amenity
    extra = 1
    fields = ('name', 'description', 'order')


@admin.register(HousePlan)
class HousePlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'bedrooms', 'bathrooms', 'price', 'is_popular', 'is_best_selling', 'is_new', 'created_at')
    list_filter = ('is_popular', 'is_best_selling', 'is_new', 'is_pet_friendly', 'bedrooms', 'bathrooms', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [HousePlanImageInline, FloorInline, FeatureInline, AmenityInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'price')
        }),
        ('Display Location', {
            'fields': ('display_location',),
            'description': 'Choose where to display this house plan'
        }),
        ('Property Details', {
            'fields': ('property_type', 'land_size', 'style', 'status')
        }),
        ('Specifications', {
            'fields': ('bedrooms', 'bathrooms', 'garage', 'square_feet', 'width_meters', 'depth_meters')
        }),
        ('Media & Links', {
            'fields': ('primary_image', 'video_url'),
            'description': 'Primary/thumbnail image and YouTube video URL'
        }),
        ('Features & Status', {
            'fields': ('is_popular', 'is_best_selling', 'is_new', 'is_pet_friendly')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HousePlanImage)
class HousePlanImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'house_plan', 'order')
    list_filter = ('house_plan', 'order')
    search_fields = ('title', 'house_plan__title')
    ordering = ('house_plan', 'order')


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ('house_plan', 'level', 'floor_area', 'bedrooms', 'bathrooms', 'order')
    list_filter = ('house_plan', 'level')
    search_fields = ('house_plan__title', 'notes')
    ordering = ('house_plan', 'order')
    inlines = [RoomInline]


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'house_plan', 'order')
    list_filter = ('house_plan',)
    search_fields = ('name', 'house_plan__title')
    ordering = ('house_plan', 'order')


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'house_plan', 'order')
    list_filter = ('house_plan',)
    search_fields = ('name', 'house_plan__title')
    ordering = ('house_plan', 'order')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'floor', 'order')
    list_filter = ('floor__house_plan', 'floor__level')
    search_fields = ('name', 'floor__house_plan__title')
    ordering = ('floor', 'order')


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'city', 'bedrooms', 'bathrooms', 'budget', 'is_reviewed', 'created_at')
    list_filter = ('is_reviewed', 'preferred_style', 'budget', 'bedrooms', 'bathrooms', 'created_at')
    search_fields = ('full_name', 'email', 'phone_number', 'city')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('full_name', 'email', 'phone_number', 'city')
        }),
        ('Design Preferences', {
            'fields': ('preferred_style', 'bedrooms', 'bathrooms', 'other_required_rooms')
        }),
        ('Property Details', {
            'fields': ('stand_length_meters', 'stand_breadth_meters', 'budget')
        }),
        ('Project Description', {
            'fields': ('project_description',)
        }),
        ('Status & Timestamps', {
            'fields': ('is_reviewed', 'created_at', 'updated_at')
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('full_name', 'email', 'phone_number', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('full_name', 'email', 'phone_number')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('Status & Timestamps', {
            'fields': ('is_read', 'created_at', 'updated_at')
        }),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    change_list_template = 'admin/houseplans/sitesettings/change_list.html'
    
    def has_add_permission(self, request):
        # Prevent adding new instances
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion
        return False
    
    def changelist_view(self, request, extra_context=None):
        # Redirect to the edit page directly
        try:
            settings = SiteSettings.objects.get(pk=1)
            return HttpResponseRedirect(f'/admin/houseplans/sitesettings/{settings.pk}/change/')
        except SiteSettings.DoesNotExist:
            # Create the default instance if it doesn't exist
            SiteSettings.objects.create(pk=1)
            return HttpResponseRedirect('/admin/houseplans/sitesettings/1/change/')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('phone', 'email', 'address', 'company_name', 'website_url')
        }),
        ('Operating Hours', {
            'fields': ('monday_friday_hours', 'saturday_hours', 'sunday_hours')
        }),
        ('Last Updated', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('updated_at',)


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'house_plan', 'plan_price', 'email', 'phone_number', 'province', 'city', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'province', 'created_at')
    search_fields = ('full_name', 'email', 'phone_number', 'house_plan__title', 'city')
    readonly_fields = ('created_at', 'updated_at', 'plan_price')
    
    fieldsets = (
        ('House Plan Information', {
            'fields': ('house_plan', 'plan_price'),
            'description': 'The plan being purchased and its price at time of purchase'
        }),
        ('Contact Information', {
            'fields': ('full_name', 'email', 'phone_number')
        }),
        ('Location Details', {
            'fields': ('province', 'city', 'pick_up_point', 'area_mall')
        }),
        ('Payment Status', {
            'fields': ('payment_status', 'payment_date'),
            'description': 'Track customer payment status and completion date'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Auto-populate plan_price from selected house plan if creating new purchase
        if not change:  # If creating new purchase
            if obj.house_plan:
                obj.plan_price = obj.house_plan.price
        super().save_model(request, obj, form, change)
