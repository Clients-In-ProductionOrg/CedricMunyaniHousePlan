import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, List, CircleHelp, Heart, Home, Bed, Bath, Car, Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_ENDPOINTS } from '@/config/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { housePlans } from '@/data/housePlans';
import { FilterState, SortOption, HousePlan } from '@/types/housePlan';
import { cn } from '@/lib/utils';
import { ImageGallery } from '@/components/ImageGallery';
import { FilterSidebar } from '@/components/FilterSidebar';
import Header from '@/components/Header';

// Helper function to convert YouTube URLs to embed format
function convertYoutubeUrl(url: string): string {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Format: https://youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
  }
  // Format: https://www.youtube.com/watch?v=VIDEO_ID&...
  else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  }
  
  return url;
}

// HousePlanCard Component
function HousePlanCard({ plan }: { plan: HousePlan }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    province: '',
    city: '',
    pickupPoint: '',
    areaMall: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({ 
    cardNumber: '', 
    expiryDate: '', 
    cvv: '' 
  });
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [yocoPublicKey, setYocoPublicKey] = useState('');

  // Fetch Yoco public key on component mount
  useEffect(() => {
    const fetchYocoKey = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.BACKEND_URL}/api/yoco-public-key/`);
        const data = await response.json();
        setYocoPublicKey(data.public_key);
      } catch (error) {
        console.error('Error fetching Yoco public key:', error);
      }
    };
    fetchYocoKey();
  }, []);

  // Payment handler using Yoco v2 showPopup API
  const handleYocoPayment = async (plan: HousePlan) => {
    try {
      const YocoSDK = (window as any).YocoSDK;
      if (!YocoSDK) {
        alert('Payment SDK not loaded. Please refresh the page.');
        return;
      }

      // First, save the purchase to database
      const purchaseResponse = await fetch(API_ENDPOINTS.PURCHASES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          house_plan_id: plan.id,
          full_name: contactInfo.name,
          email: contactInfo.email,
          phone_number: contactInfo.phone,
          province: contactInfo.province,
          city: contactInfo.city,
          pick_up_point: contactInfo.pickupPoint,
          area_mall: contactInfo.areaMall,
        })
      });

      const purchaseData = await purchaseResponse.json();
      if (!purchaseData.id) {
        alert('Error creating purchase. Please try again.');
        return;
      }

      // Initialize Yoco v2 with correct API
      const yoco = new YocoSDK({
        publicKey: yocoPublicKey,
      });

      // Show payment popup (v2 correct method)
      yoco.showPopup({
        amountInCents: Math.round(plan.price * 100), // Convert to cents
        currency: 'ZAR',
        name: 'House Plan Purchase',
        description: plan.title,
        callback: async (result: any) => {
          if (result.error) {
            console.error('Payment failed:', result.error);
            alert('Payment failed: ' + result.error.message);
          } else {
            // Payment successful - send token to backend
            const verifyResponse = await fetch(`${API_ENDPOINTS.BACKEND_URL}/api/process-payment/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                purchase_id: purchaseData.id,
                token: result.id, // Yoco token
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setShowSuccessModal(true);
              // Reset form
              setContactInfo({ name: '', email: '', phone: '', province: '', city: '', pickupPoint: '', areaMall: '' });
            } else {
              alert('Payment verification failed: ' + verifyData.error);
            }
          }
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing error. Please try again.');
    }
  };

  const handleOpenGallery = () => {
    console.log(`Opening gallery for ${plan.title}`, {
      totalImages: plan.images.length,
      images: plan.images
    });
    setIsGalleryOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div 
          className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer group"
          onClick={handleOpenGallery}
        >
          <img
            src={plan.images[currentImageIndex]}
            alt={plan.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
              View All {plan.images.length} Photos
            </span>
          </div>
          
          <div className="absolute top-3 left-3 flex gap-2">
            {plan.isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {plan.isPopular && (
              <Badge className="bg-accent text-accent-foreground">Popular</Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <Heart
              className={cn(
                'w-5 h-5',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>

          {plan.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {plan.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentImageIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <ImageGallery
          images={plan.images}
          initialIndex={currentImageIndex}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          title={plan.title}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {plan.title}
              </h3>
            </div>
            {plan.videoUrl && (
              <Button 
                size="sm"
                onClick={() => setShowVideo(true)}
                className="bg-red-400 hover:bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Houseplan Video
              </Button>
            )}
          </div>

          <p className="text-2xl font-bold text-primary mb-4">
            R{plan.price.toLocaleString()}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>{plan.floorArea} m²</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>{plan.bedrooms} Bedrooms</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bath className="w-4 h-4" />
                <span>{plan.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="w-4 h-4" />
                <span>{plan.garage} Garage</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b">
            <span>{plan.levels} Level{plan.levels > 1 ? 's' : ''}</span>
            <span>{plan.width}m × {plan.depth}m</span>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={() => navigate(`/house-details/${plan.id}`)}
            >
              View Details
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold" 
              size="lg"
              onClick={() => setShowBuyModal(true)}
            >
              Buy plan Online
            </Button>
          </div>
        </div>
      </Card>

      {showVideo && plan.videoUrl && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <div 
            className="w-full h-full bg-black overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={convertYoutubeUrl(plan.videoUrl)}
              title={plan.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}



      {/* Buy Plan Modal */}
      {showBuyModal && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Purchase {plan.title}</h2>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan Price</p>
                  <p className="text-3xl font-bold text-primary">R{plan.price.toLocaleString()}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Province"
                    value={contactInfo.province}
                    onChange={(e) => setContactInfo({ ...contactInfo, province: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={contactInfo.city}
                    onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Pick-up Point"
                    value={contactInfo.pickupPoint}
                    onChange={(e) => setContactInfo({ ...contactInfo, pickupPoint: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Area / Mall"
                    value={contactInfo.areaMall}
                    onChange={(e) => setContactInfo({ ...contactInfo, areaMall: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    setShowBuyModal(false);
                    handleYocoPayment(plan);
                  }}
                >
                  Proceed to Payment
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowBuyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6 text-center">
              {/* Checkmark Circle */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{plan.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">R{plan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{contactInfo.email}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to <strong>{contactInfo.email}</strong>
              </p>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowBuyModal(false);
                  setContactInfo({ name: '', email: '', phone: '', province: '', city: '', pickupPoint: '', areaMall: '' });
                  setPaymentInfo({ cardNumber: '', expiryDate: '', cvv: '' });
                }}
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

// Main HousePlans Page Component
export const HousePlans = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [plans, setPlans] = useState<HousePlan[]>(housePlans); // Fallback to static data
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  // Fetch house plans from backend on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching house plans from API');
        const response = await fetch(`${API_ENDPOINTS.PLANS}`);
        const data = await response.json();
        console.log('API Response:', data);
        
        if (response.ok) {
          // Handle both paginated (data.results) and direct array responses
          const plansList = Array.isArray(data) ? data : data.results || [];
          console.log('Plans List:', plansList);
          
          // Transform backend data to frontend format
          const transformedPlans = plansList.map((plan: any) => {
            // Get all images
            const allImages = [
              ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
              ...(plan.primary_image ? [plan.primary_image] : [])
            ].filter(img => img);
            
            const images = allImages.length > 0 ? allImages : ['https://via.placeholder.com/600x400'];
            
            console.log(`Plan: ${plan.title}, Total Images: ${images.length}`, {
              images_count: plan.images?.length || 0,
              primary_image: plan.primary_image ? 'yes' : 'no'
            });
            
            return {
              id: plan.id.toString(),
              title: plan.title,
              price: Math.round(plan.price),
              bedrooms: plan.bedrooms,
              bathrooms: Math.round(plan.bathrooms),
              garage: plan.garage || 2,
              floorArea: plan.square_feet,
              levels: plan.floors?.length || 2,
              width: plan.width_meters || 30,
              depth: plan.depth_meters || 40,
              style: [plan.style] || ['Modern'],
              isNew: plan.is_new || false,
              isPopular: plan.is_popular || false,
              images: images,
              description: plan.description || '',
              features: plan.features?.map((f: any) => f.name) || [],
              videoUrl: plan.video_url || '',
              enSuite: 1,
              lounges: plan.floors?.reduce((sum: number, f: any) => sum + (f.lounges || 0), 0) || 1,
              diningAreas: plan.floors?.reduce((sum: number, f: any) => sum + (f.dining_areas || 0), 0) || 1,
              garageParking: plan.garage || 1,
              coveredParking: 2,
              petFriendly: plan.is_pet_friendly || false,
              amenities: plan.amenities?.map((a: any) => a.name) || [],
              floors: plan.floors || [],
              propertyType: plan.property_type,
              landSize: plan.land_size,
              status: plan.status
            };
          });
          console.log('Transformed Plans:', transformedPlans);
          setPlans(transformedPlans);
        } else {
          console.error('API Error - Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to static data
        console.log('Using fallback static data');
        setPlans(housePlans);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Listen for search events from header
  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchQuery(customEvent.detail.query);
      setCurrentPage(1); // Reset to first page
    };

    window.addEventListener('planSearch', handleSearch);
    return () => window.removeEventListener('planSearch', handleSearch);
  }, []);

  // Handle scroll to hide/show header on mobile
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      const currentScrollY = contentElement.scrollTop;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Filter and sort house plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = [...plans];

    // Apply filters
    if (filters.priceMin) {
      filtered = filtered.filter((plan) => plan.price >= filters.priceMin!);
    }
    if (filters.priceMax) {
      filtered = filtered.filter((plan) => plan.price <= filters.priceMax!);
    }
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      filtered = filtered.filter((plan) =>
        filters.bedrooms!.some((bed) => plan.bedrooms >= bed)
      );
    }
    if (filters.bathrooms && filters.bathrooms.length > 0) {
      filtered = filtered.filter((plan) =>
        filters.bathrooms!.some((bath) => plan.bathrooms >= bath)
      );
    }
    if (filters.levels && filters.levels.length > 0) {
      filtered = filtered.filter((plan) => {
        return filters.levels!.some((level) => {
          if (level === 4) return plan.levels >= 3; // 3+ means 3 or more
          return plan.levels === level;
        });
      });
    }
    if (filters.floorAreaMin) {
      filtered = filtered.filter((plan) => plan.floorArea >= filters.floorAreaMin!);
    }
    if (filters.floorAreaMax) {
      filtered = filtered.filter((plan) => plan.floorArea <= filters.floorAreaMax!);
    }
    if (filters.garage && filters.garage.length > 0) {
      filtered = filtered.filter((plan) =>
        filters.garage!.some((gar) => plan.garage >= gar)
      );
    }
    if (filters.styles && filters.styles.length > 0) {
      filtered = filtered.filter((plan) =>
        plan.style.some((s) => filters.styles!.includes(s))
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((plan) =>
        plan.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return filtered;
  }, [filters, sortBy, searchQuery, plans]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const paginatedPlans = filteredAndSortedPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
        {/* Filter Sidebar */}
        <div className="hidden md:block md:w-64 lg:w-72">
          <FilterSidebar onFilterChange={setFilters} onClearAll={handleClearFilters} />
        </div>

        {/* Main Content */}
        <div 
          ref={contentRef}
          className="flex-1 w-full overflow-y-auto"
        >
          {/* Header - Hidden on mobile when scrolling */}
          <div 
            className={`border-b bg-background sticky top-0 z-10 transition-all duration-300 md:translate-y-0 ${
              showHeader ? 'translate-y-0' : '-translate-y-full'
            }`}
          >
            <div className="px-4 md:px-8 py-4 md:py-6">
              <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  House Plans Catalog
                </h1>

                {/* Search Bar and Filter Button */}
                <div className="flex items-center gap-2 w-full">
                  <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search by plan name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        window.dispatchEvent(
                          new CustomEvent("planSearch", { detail: { query: searchQuery } })
                        );
                      }
                    }}
                    className="h-9"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {/* Filter Button (Mobile Only) */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setIsFilterDrawerOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Sort Dropdown */}
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-high">Price High → Low</SelectItem>
                      <SelectItem value="price-low">Price Low → High</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex gap-1 border rounded-md p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <p className="text-sm md:text-base text-muted-foreground">
                Showing {filteredAndSortedPlans.length} results
              </p>
            </div>
          </div>

          {/* House Plans Grid */}
          <div className="p-4 md:p-6 lg:p-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading house plans...</p>
              </div>
            ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedPlans.length > 0 ? (
                paginatedPlans.map((plan) => (
                  <HousePlanCard key={plan.id} plan={plan} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No plans found matching your criteria.</p>
                </div>
              )}
            </div>
            )}

            {/* Pagination */}
            {paginatedPlans.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                          currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {totalPages > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
      >
        <CircleHelp className="h-6 w-6" />
      </Button>

      {/* Filter Drawer (Mobile) */}
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            <FilterSidebar onFilterChange={setFilters} onClearAll={handleClearFilters} />
          </div>
        </DrawerContent>
      </Drawer>
      </div>
    </>
  );
};

export default HousePlans;
