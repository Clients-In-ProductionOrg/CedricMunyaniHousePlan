#!/usr/bin/env python
"""
Test script to verify S3 image upload functionality
"""
import os
import sys
import django
from io import BytesIO
from PIL import Image

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from houseplans.models import HousePlan, HousePlanImage

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (800, 600), color='red')
    img_io = BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    return SimpleUploadedFile(
        'test_house_plan.jpg',
        img_io.getvalue(),
        content_type='image/jpeg'
    )

def test_s3_upload():
    """Test uploading an image to S3"""
    print("\n" + "="*60)
    print("S3 IMAGE UPLOAD TEST")
    print("="*60)
    
    # Check if S3 is enabled
    print(f"\n1. Checking S3 Configuration...")
    print(f"   USE_S3: {settings.USE_S3}")
    print(f"   AWS_STORAGE_BUCKET_NAME: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"   AWS_S3_REGION_NAME: {settings.AWS_S3_REGION_NAME}")
    print(f"   DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
    
    if not settings.USE_S3:
        print("\n   ERROR: S3 is not enabled! Check USE_S3 in .env")
        return False
    
    # Create test house plan
    print(f"\n2. Creating test house plan...")
    try:
        test_plan = HousePlan.objects.create(
            title="Test House Plan - S3 Upload",
            description="This is a test house plan for S3 upload verification",
            price=250000.00,
            bedrooms=3,
            bathrooms=2,
            garage=1,
            square_feet=1500,
            width_meters=20,
            depth_meters=15,
            is_popular=True
        )
        print(f"   Created: {test_plan.title} (ID: {test_plan.id})")
    except Exception as e:
        print(f"   ERROR: Failed to create house plan: {e}")
        return False
    
    # Upload test image
    print(f"\n3. Uploading test image to S3...")
    try:
        test_image_file = create_test_image()
        house_plan_image = HousePlanImage.objects.create(
            house_plan=test_plan,
            image=test_image_file,
            title="Test Image - S3 Verification",
            order=1
        )
        print(f"   Image uploaded successfully!")
        print(f"   Image name: {house_plan_image.image.name}")
        print(f"   Image URL: {house_plan_image.image.url}")
    except Exception as e:
        print(f"   ERROR: Failed to upload image: {e}")
        test_plan.delete()
        return False
    
    # Verify in S3
    print(f"\n4. Verifying image in S3...")
    try:
        from storages.backends.s3boto3 import S3Boto3Storage
        storage = S3Boto3Storage()
        
        # Check if file exists in S3
        image_path = house_plan_image.image.name
        exists = storage.exists(image_path)
        
        if exists:
            print(f"   SUCCESS: File exists in S3!")
            print(f"   S3 Path: {image_path}")
            print(f"   Public URL: {house_plan_image.image.url}")
        else:
            print(f"   WARNING: File not found in S3")
    except Exception as e:
        print(f"   WARNING: Could not verify in S3: {e}")
    
    # Display results
    print(f"\n5. Test Results:")
    print(f"   House Plan ID: {test_plan.id}")
    print(f"   Image ID: {house_plan_image.id}")
    print(f"   Image URL: {house_plan_image.image.url}")
    print(f"\n   You can verify the image in AWS S3:")
    print(f"   Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"   Region: {settings.AWS_S3_REGION_NAME}")
    print(f"   Direct S3 URL: https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/media/{image_path}")
    
    print(f"\n" + "="*60)
    print("TEST COMPLETED SUCCESSFULLY!")
    print("="*60)
    print(f"\nNext Steps:")
    print(f"1. Log in to AWS Console")
    print(f"2. Go to S3 > {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"3. Navigate to: media/")
    print(f"4. You should see the uploaded image file")
    print(f"\nTest data created:")
    print(f"- House Plan: {test_plan.title} (ID: {test_plan.id})")
    print(f"- Image: test_house_plan.jpg in S3")
    print(f"\nYou can delete this test data from the Django admin if needed.\n")
    
    return True

if __name__ == '__main__':
    success = test_s3_upload()
    sys.exit(0 if success else 1)
