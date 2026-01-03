from django.db import models
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage

class HousePlanImageStorage(S3Boto3Storage):
    """Custom S3 storage for house plan images"""
    location = 'media'
    file_overwrite = False

class HousePlan(models.Model):
    DISPLAY_LOCATION_CHOICES = [
        ('house_plans_page', 'House Plans Page'),
        ('built_plans_page', 'Built Plans Page'),
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('villa', 'Villa'),
        ('cottage', 'Cottage'),
    ]
    
    STYLE_CHOICES = [
        ('contemporary', 'Contemporary'),
        ('modern', 'Modern'),
        ('traditional', 'Traditional'),
        ('colonial', 'Colonial'),
        ('craftsman', 'Craftsman'),
        ('farmhouse', 'Farmhouse'),
        ('mediterranean', 'Mediterranean'),
        ('minimalist', 'Minimalist'),
    ]
    
    STATUS_CHOICES = [
        ('featured', 'Featured'),
        ('normal', 'Normal'),
        ('limited', 'Limited Edition'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Display Location
    display_location = models.CharField(
        max_length=50, 
        choices=DISPLAY_LOCATION_CHOICES, 
        default='house_plans_page'
    )
    
    # Property Details
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE_CHOICES, default='house')
    land_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Land size in m²")
    style = models.CharField(max_length=100, blank=True, help_text="e.g., Contemporary, Modern")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='normal')
    
    # Specifications
    bedrooms = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    garage = models.IntegerField(default=0)
    square_feet = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    width_meters = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Width in meters")
    depth_meters = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Depth in meters")
    
    # Media & Links
    primary_image = models.ImageField(upload_to='house_plans/', blank=True, null=True, help_text="Primary/thumbnail image")
    video_url = models.URLField(blank=True, null=True, help_text="YouTube video URL")
    
    # Features & Status
    is_popular = models.BooleanField(default=False, help_text="Show in 'Popular House Plans' section")
    is_best_selling = models.BooleanField(default=False, help_text="Show in 'Best-Selling Designs' section")
    is_new = models.BooleanField(default=False)
    is_pet_friendly = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "House Plan"
        verbose_name_plural = "House Plans"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class HousePlanImage(models.Model):
    house_plan = models.ForeignKey(HousePlan, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(
        upload_to='house_plan_images/',
        storage=HousePlanImageStorage() if settings.USE_S3 else None
    )
    title = models.CharField(max_length=200, blank=True, help_text="Image title or description")
    order = models.IntegerField(default=0, help_text="Order to display images")
    
    class Meta:
        ordering = ['order']
        verbose_name = "House Plan Image"
        verbose_name_plural = "House Plan Images"
    
    def __str__(self):
        return f"{self.house_plan.title} - Image {self.order}"


class Floor(models.Model):
    LEVEL_CHOICES = [
        ('ground', 'Ground Floor'),
        ('first', 'First Floor'),
        ('second', 'Second Floor'),
        ('third', 'Third Floor'),
        ('fourth', 'Fourth Floor'),
        ('fifth', 'Fifth Floor'),
        ('sixth', 'Sixth Floor'),
        ('seventh', 'Seventh Floor'),
        ('eighth', 'Eighth Floor'),
        ('ninth', 'Ninth Floor'),
        ('tenth', 'Tenth Floor'),
        ('basement', 'Basement'),
    ]
    
    house_plan = models.ForeignKey(HousePlan, on_delete=models.CASCADE, related_name='floors')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    floor_area = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bedrooms = models.IntegerField(default=0)
    bathrooms = models.IntegerField(default=0)
    lounges = models.IntegerField(default=0)
    dining_areas = models.IntegerField(default=0)
    notes = models.TextField(blank=True, help_text="Floor-specific notes or description")
    order = models.IntegerField(default=0, help_text="Order to display floors")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Floor"
        verbose_name_plural = "Floors"
    
    def __str__(self):
        return f"{self.house_plan.title} - {self.get_level_display()}"


class Feature(models.Model):
    house_plan = models.ForeignKey(HousePlan, on_delete=models.CASCADE, related_name='features')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Feature"
        verbose_name_plural = "Features"
    
    def __str__(self):
        return f"{self.house_plan.title} - {self.name}"


class Amenity(models.Model):
    house_plan = models.ForeignKey(HousePlan, on_delete=models.CASCADE, related_name='amenities_list')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"
    
    def __str__(self):
        return f"{self.house_plan.title} - {self.name}"


class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=200, help_text="e.g., Master Bedroom, Kitchen, Living Room, etc.")
    quantity = models.IntegerField(default=1, help_text="Number of this room type (e.g., 2 for Bedroom 2)")
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0, help_text="Order to display rooms")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Room"
        verbose_name_plural = "Rooms"
    
    def __str__(self):
        return f"{self.floor.house_plan.title} - {self.floor.get_level_display()} - {self.name}"


class QuoteRequest(models.Model):
    BUDGET_CHOICES = [
        ('under_500k', 'Under R500,000'),
        ('500k_1m', 'R500,000 - R1,000,000'),
        ('1m_2m', 'R1,000,000 - R2,000,000'),
        ('2m_3m', 'R2,000,000 - R3,000,000'),
        ('3m_5m', 'R3,000,000 - R5,000,000'),
        ('above_5m', 'Above R5,000,000'),
    ]
    
    STYLE_CHOICES = [
        ('contemporary', 'Contemporary'),
        ('modern', 'Modern'),
        ('traditional', 'Traditional'),
        ('colonial', 'Colonial'),
        ('craftsman', 'Craftsman'),
        ('farmhouse', 'Farmhouse'),
        ('mediterranean', 'Mediterranean'),
        ('minimalist', 'Minimalist'),
        ('not_sure', 'Not Sure'),
    ]
    
    # Contact Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    
    # Design Preferences
    preferred_style = models.CharField(max_length=50, choices=STYLE_CHOICES)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    other_required_rooms = models.TextField(blank=True, help_text="e.g., Home office, gym, guest suite, entertainment area...")
    
    # Property Details
    stand_length_meters = models.DecimalField(max_digits=8, decimal_places=2, help_text="Length in meters")
    stand_breadth_meters = models.DecimalField(max_digits=8, decimal_places=2, help_text="Breadth in meters")
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    
    # Project Description
    project_description = models.TextField(help_text="Describe your vision for the home, any specific features, lifestyle needs, or inspiration...")
    
    # Timestamps & Status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_reviewed = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Quote Request from {self.full_name} - {self.created_at.strftime('%Y-%m-%d')}"


class ContactMessage(models.Model):
    # Contact Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    
    # Message Details
    subject = models.CharField(max_length=200, help_text="What is this about?")
    message = models.TextField(help_text="Tell us more about your project...")
    
    # Status & Timestamps
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.full_name} - {self.subject}"


class SiteSettings(models.Model):
    # Contact Information
    phone = models.CharField(max_length=20, blank=True, default="", help_text="e.g., 0695885837")
    email = models.EmailField(blank=True, default="", help_text="e.g., Cedrichouseplan@gmail.com")
    address = models.TextField(blank=True, default="", help_text="e.g., South Africa, Venda")
    
    # Operating Hours
    monday_friday_hours = models.CharField(max_length=100, default="9:00 AM - 6:00 PM", help_text="Monday - Friday hours")
    saturday_hours = models.CharField(max_length=100, default="10:00 AM - 4:00 PM", help_text="Saturday hours")
    sunday_hours = models.CharField(max_length=100, default="Closed", help_text="Sunday hours")
    
    # Additional Info
    company_name = models.CharField(max_length=200, blank=True, help_text="Your company name")
    website_url = models.URLField(blank=True, help_text="Your website URL")
    
    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return "Site Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Prevent deletion
        pass
    
    @classmethod
    def get_settings(cls):
        # Get or create the singleton instance
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class Purchase(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('completed', 'Payment Completed'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Payment Failed'),
    ]
    
    PROVINCE_CHOICES = [
        ('eastern_cape', 'Eastern Cape'),
        ('free_state', 'Free State'),
        ('gauteng', 'Gauteng'),
        ('kwazulu_natal', 'KwaZulu-Natal'),
        ('limpopo', 'Limpopo'),
        ('mpumalanga', 'Mpumalanga'),
        ('northern_cape', 'Northern Cape'),
        ('north_west', 'North West'),
        ('western_cape', 'Western Cape'),
    ]
    
    # Plan Information
    house_plan = models.ForeignKey(HousePlan, on_delete=models.CASCADE, related_name='purchases')
    plan_price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Price at time of purchase")
    
    # Contact Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    
    # Location Information
    province = models.CharField(max_length=50, choices=PROVINCE_CHOICES)
    city = models.CharField(max_length=150)
    pick_up_point = models.CharField(max_length=255, blank=True, help_text="Optional: Specific location for pickup")
    area_mall = models.CharField(max_length=255, blank=True, help_text="e.g., Johannesburg CBD, Sandton City")
    
    # Payment Status
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default='pending',
        help_text="Current payment status"
    )
    
    # Payment Information
    yoco_reference = models.CharField(max_length=255, blank=True, null=True, help_text="Yoco payment reference ID")
    yoco_token = models.CharField(max_length=255, blank=True, null=True, help_text="Yoco payment token")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_date = models.DateTimeField(null=True, blank=True, help_text="Date when payment was completed")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Purchase"
        verbose_name_plural = "Purchases"
    
    def __str__(self):
        return f"{self.full_name} - {self.house_plan.title} ({self.get_payment_status_display()})"
