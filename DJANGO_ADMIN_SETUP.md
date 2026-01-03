# Django Admin Site Setup - Cedric House Plans

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Create Migrations
```bash
python manage.py makemigrations
```

### 3. Apply Migrations
```bash
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Run Development Server
```bash
python manage.py runserver
```

### 6. Access Admin Site
Open your browser and navigate to:
```
http://localhost:8000/admin/
```

Log in with your superuser credentials.

## Admin Features

### Fully Configured Models

1. **House Plans**
   - Title, category, price, bedrooms, bathrooms, square footage
   - Image preview in admin
   - Featured and status management
   - Rating and reviews tracking

2. **Built Homes**
   - Project documentation with images
   - Location, builder, and completion date tracking
   - Link to house plans
   - Status management (completed, in progress, planned)

3. **Testimonials**
   - Customer testimonials with ratings
   - Image support for customer photos
   - Featured testimonials
   - Approval workflow

4. **Contact Messages**
   - Contact form submissions
   - Status tracking (new, in progress, resolved, closed)
   - Response management
   - Read/unread status

5. **Quote Requests**
   - Customer quote requests
   - Status tracking
   - Quote amount management
   - Admin notes

6. **Services**
   - Service management
   - Icon support
   - Order/sorting
   - Active/inactive toggle

## Admin Customizations

### Visual Enhancements
- Status badges with color coding
- Image previews in admin list and detail views
- Star ratings display
- Badge indicators for important statuses

### Filtering & Search
- Filter by status, category, dates
- Advanced search across relevant fields
- Quick access to featured items

### Readonly Fields
- Automatic slug generation
- Timestamp protection
- Image preview readonly

## Models Structure

```
HousePlan
├── title (CharField)
├── category (Choice: modern, traditional, contemporary, minimalist, luxury)
├── price (DecimalField)
├── bedrooms/bathrooms (IntegerField)
├── square_feet (IntegerField)
├── status (Choice: available, sold_out, coming_soon)
└── is_featured (Boolean)

BuiltHome
├── title (CharField)
├── house_plan (ForeignKey to HousePlan)
├── location (CharField)
├── status (Choice: completed, in_progress, planned)
├── completion_date (DateField)
└── price (DecimalField)

Testimonial
├── customer_name (CharField)
├── content (TextField)
├── rating (IntegerField: 1-5)
├── house_plan (ForeignKey to HousePlan)
├── is_featured (Boolean)
└── is_approved (Boolean)

Contact
├── name, email, phone (Contact info)
├── subject, message (Content)
├── status (Choice: new, in_progress, resolved, closed)
└── response (TextField)

Quote
├── customer info (name, email, phone)
├── house_plan (ForeignKey to HousePlan)
├── status (Choice: pending, sent, accepted, rejected, expired)
└── quote_amount (DecimalField)

Service
├── title (CharField)
├── description (TextField)
├── icon (CharField)
├── order (PositiveIntegerField)
└── is_active (Boolean)
```

## API Endpoints

All models have REST API endpoints:

- **House Plans**: `/api/core/house-plans/`
- **Built Homes**: `/api/core/built-homes/`
- **Testimonials**: `/api/core/testimonials/`
- **Contacts**: `/api/core/contacts/`
- **Quotes**: `/api/core/quotes/`
- **Services**: `/api/core/services/`

### Special Endpoints
- `/api/core/house-plans/featured/` - Get featured house plans
- `/api/core/testimonials/featured/` - Get featured testimonials

## Database Configuration

The project uses PostgreSQL (configured in settings.py). 
Configuration from `.env` file:
- DATABASE_URL
- DEBUG
- SECRET_KEY
- AWS S3 credentials (optional)

## Notes

- The admin site is fully customized with the site header "Cedric House Plans Admin"
- All models include proper timestamps (created_at, updated_at)
- Database indexes are configured for optimal query performance
- Admin list displays are optimized with relevant fields and filters
