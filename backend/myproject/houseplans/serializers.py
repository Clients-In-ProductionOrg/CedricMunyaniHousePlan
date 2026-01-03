from rest_framework import serializers
from .models import HousePlan, HousePlanImage, Floor, Room, Feature, Amenity, SiteSettings

class HousePlanImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousePlanImage
        fields = ['id', 'image', 'title', 'order']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'quantity', 'description', 'order']

class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    
    class Meta:
        model = Floor
        fields = ['id', 'level', 'floor_area', 'bedrooms', 'bathrooms', 'lounges', 'dining_areas', 'notes', 'order', 'rooms']

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name', 'description', 'order']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'description', 'order']

class HousePlanListSerializer(serializers.ModelSerializer):
    """Serializer for listing house plans (shorter format)"""
    images = HousePlanImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = HousePlan
        fields = [
            'id', 'title', 'description', 'price', 'bedrooms', 'bathrooms',
            'garage', 'square_feet', 'width_meters', 'depth_meters',
            'primary_image', 'images', 'style', 'status', 'is_popular',
            'is_best_selling', 'is_new', 'is_pet_friendly'
        ]

class HousePlanDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed house plan view"""
    images = HousePlanImageSerializer(many=True, read_only=True)
    floors = FloorSerializer(many=True, read_only=True)
    features = FeatureSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    
    class Meta:
        model = HousePlan
        fields = [
            'id', 'title', 'description', 'price', 'bedrooms', 'bathrooms',
            'garage', 'square_feet', 'width_meters', 'depth_meters',
            'primary_image', 'video_url', 'images', 'floors', 'features', 'amenities',
            'property_type', 'land_size', 'style', 'status',
            'is_popular', 'is_best_selling', 'is_new', 'is_pet_friendly',
            'created_at', 'updated_at'
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for site settings"""
    class Meta:
        model = SiteSettings
        fields = [
            'phone', 'email', 'address', 'company_name', 'website_url',
            'monday_friday_hours', 'saturday_hours', 'sunday_hours', 'updated_at'
        ]
