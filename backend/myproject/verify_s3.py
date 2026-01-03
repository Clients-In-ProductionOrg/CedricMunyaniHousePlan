#!/usr/bin/env python
"""
Verify S3 bucket contents and test image upload
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.conf import settings
import boto3

def verify_s3_credentials():
    """Verify AWS credentials are working"""
    print("\n" + "="*70)
    print("AWS CREDENTIALS VERIFICATION")
    print("="*70)
    
    try:
        # Check credentials
        access_key = settings.AWS_ACCESS_KEY_ID
        secret_key = settings.AWS_SECRET_ACCESS_KEY
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        region = settings.AWS_S3_REGION_NAME
        
        print(f"\nCredentials loaded from .env:")
        print(f"  Access Key: {access_key[:10]}..." if access_key else "  Access Key: NOT SET")
        print(f"  Secret Key: {secret_key[:10]}..." if secret_key else "  Secret Key: NOT SET")
        print(f"  Bucket: {bucket}")
        print(f"  Region: {region}")
        
        # Create S3 client
        print(f"\nConnecting to S3...")
        s3_client = boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
        
        # List objects in bucket
        print(f"\nListing objects in bucket '{bucket}'...")
        response = s3_client.list_objects_v2(Bucket=bucket, MaxKeys=100)
        
        if 'Contents' in response:
            print(f"\nFound {len(response['Contents'])} objects in bucket:")
            for obj in response['Contents']:
                print(f"  - {obj['Key']} (Size: {obj['Size']} bytes)")
                
                # Check for our test image
                if 'test_house_plan' in obj['Key']:
                    print(f"    ✓ TEST IMAGE FOUND IN S3!")
        else:
            print(f"\nBucket appears to be empty or no media files found yet")
        
        # List files in media folder
        print(f"\nChecking 'media/' folder specifically...")
        response = s3_client.list_objects_v2(Bucket=bucket, Prefix='media/', MaxKeys=100)
        
        if 'Contents' in response:
            print(f"Found {len(response['Contents'])} objects in media/:")
            for obj in response['Contents']:
                key = obj['Key']
                if key != 'media/':  # Skip the folder itself
                    print(f"  - {key} (Size: {obj['Size']} bytes)")
                    if 'test_house_plan' in key:
                        print(f"    ✓ TEST IMAGE CONFIRMED IN S3!")
        else:
            print(f"No files found in media/ folder")
        
        print(f"\n" + "="*70)
        print("✓ S3 CONNECTION SUCCESSFUL!")
        print("="*70)
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print(f"\nPlease verify:")
        print(f"1. AWS credentials in .env file are correct")
        print(f"2. Bucket 'munyaihouseplansmedia' exists in region '{region}'")
        print(f"3. AWS credentials have s3:ListBucket and s3:GetObject permissions")
        print(f"\n" + "="*70)
        return False

if __name__ == '__main__':
    success = verify_s3_credentials()
    sys.exit(0 if success else 1)
