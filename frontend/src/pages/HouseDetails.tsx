import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Phone, Mail, MapPin, Home, Bed, Bath, Square, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import { API_ENDPOINTS } from '@/config/constants';
import { housePlans } from '@/data/housePlans';
import { builtHomes } from '@/data/builtHomes';

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

export const HouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [newRoomName, setNewRoomName] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [expandedFloors, setExpandedFloors] = useState<Record<number, boolean>>({ 0: true });
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
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
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch plan from API
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PLAN_DETAIL(id));
        if (response.ok) {
          const planData = await response.json();
          console.log('Plan Detail API Response:', planData);
          
          // Transform images from API response
          const allImages = [
            ...(planData.images?.map((img: any) => img.image || img.image_url) || []),
            ...(planData.primary_image ? [planData.primary_image] : [])
          ].filter(img => img);
          
          const images = allImages.length > 0 ? allImages : ['https://via.placeholder.com/600x400'];

          // Transform the plan data
          const transformedPlan = {
            id: planData.id.toString(),
            title: planData.title,
            price: Math.round(planData.price),
            bedrooms: planData.bedrooms,
            bathrooms: Math.round(planData.bathrooms),
            garage: planData.garage || 2,
            floorArea: planData.square_feet,
            levels: planData.floors?.length || 2,
            width: planData.width_meters || 30,
            depth: planData.depth_meters || 40,
            style: [planData.style] || ['Modern'],
            isNew: planData.is_new || false,
            isPopular: planData.is_popular || false,
            images: images,
            description: planData.description || '',
            features: planData.features?.map((f: any) => f.name) || [],
            videoUrl: planData.video_url || '',
            enSuite: 1,
            lounges: planData.floors?.reduce((sum: number, f: any) => sum + (f.lounges || 0), 0) || 1,
            diningAreas: planData.floors?.reduce((sum: number, f: any) => sum + (f.dining_areas || 0), 0) || 1,
            garageParking: planData.garage || 1,
            coveredParking: 2,
            petFriendly: planData.is_pet_friendly || false,
            amenities: planData.amenities?.map((a: any) => a.name) || [],
            floors: planData.floors || [],
            propertyType: planData.property_type,
            landSize: planData.land_size,
            status: planData.status
          };
          
          console.log('Transformed Plan:', transformedPlan);
          setPlan(transformedPlan);
          setLoading(false);
        } else {
          // Fallback to static data if API fails
          const staticPlan = housePlans.find((p) => p.id === id) || builtHomes.find((p) => p.id === id);
          setPlan(staticPlan || null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
        // Fallback to static data
        const staticPlan = housePlans.find((p) => p.id === id) || builtHomes.find((p) => p.id === id);
        setPlan(staticPlan || null);
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground mb-6">Please wait while we load the house plan details.</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">House Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">The house plan you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/house-plans')}>Back to House Plans</Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % plan.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + plan.images.length) % plan.images.length);
  };

  const toggleFloor = (floorNumber: number) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorNumber]: !prev[floorNumber]
    }));
  };

  const propertyFeatures = [
    { label: 'Bedrooms', value: plan.bedrooms, icon: Bed },
    { label: 'Bathrooms', value: plan.bathrooms, icon: Bath },
    { label: 'Garage', value: plan.garage, icon: Home },
    { label: 'Levels', value: plan.levels, icon: Home },
    { label: 'Floor Area', value: `${plan.floorArea} m²`, icon: Square },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Image Gallery and Content */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div 
              className="relative mb-4 bg-gray-200 rounded-lg overflow-hidden aspect-video cursor-pointer group"
              onClick={() => setShowImageFullscreen(true)}
            >
              <img
                src={plan.images[currentImageIndex]}
                alt={plan.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Fullscreen icon on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                  Click to view fullscreen
                </span>
              </div>

              {/* Image Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {plan.images.length}
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {plan.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Watch Video Button */}
            {plan.videoUrl && (
              <div className="mt-4">
                <Button 
                  size="lg"
                  onClick={() => setShowVideo(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                >
                  <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch House Plan Video
                </Button>
              </div>
            )}

            {/* Description Section */}
            <div className="mt-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                {plan.isNew && (
                  <Badge className="bg-accent text-accent-foreground mb-3">New Listing</Badge>
                )}
              </div>

              <p className="text-gray-600">
                {showFullDescription ? plan.description : `${plan.description?.substring(0, 150)}...`}
              </p>
              {plan.description && plan.description.length > 150 && (
                <Button
                  variant="link"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="p-0 h-auto"
                >
                  {showFullDescription ? '- Show less' : '+ Show more'}
                </Button>
              )}

              {/* Features List */}
              {plan.features && plan.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Features Grid with Room Breakdown */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                {propertyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="p-4 text-center">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground mb-1">{feature.label}</p>
                      <p className="text-lg font-bold">{feature.value}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Room Breakdown - Floors Section */}
              {plan.floors && plan.floors.length > 0 && (
                <div className="mt-6 space-y-4">
                  {plan.floors.map((floor: any, floorIndex: number) => {
                    const floorColors = [
                      { from: 'from-slate-700', to: 'to-slate-800', border: 'border-slate-600', bg: 'from-slate-50', bgBorder: 'border-slate-300', text: 'text-slate-700', button: 'group-hover:text-blue-100' },
                      { from: 'from-indigo-700', to: 'to-indigo-800', border: 'border-indigo-600', bg: 'from-indigo-50', bgBorder: 'border-indigo-300', text: 'text-indigo-700', button: 'group-hover:text-indigo-100' },
                      { from: 'from-slate-800', to: 'to-slate-900', border: 'border-slate-700', bg: 'from-slate-50', bgBorder: 'border-slate-300', text: 'text-slate-700', button: 'group-hover:text-slate-100' },
                    ];
                    const colors = floorColors[floorIndex] || floorColors[0];

                    return (
                      <div key={floorIndex}>
                        <button
                          onClick={() => toggleFloor(floorIndex)}
                          className={`w-full flex items-center justify-between p-4 bg-gradient-to-r ${colors.from} ${colors.to} border-3 ${colors.border} rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all cursor-pointer group shadow-lg hover:shadow-2xl transform hover:scale-105`}
                        >
                          <h3 className={`text-lg font-black text-white drop-shadow-lg ${colors.button} transition-colors animate-pulse`}>
                            ⚡ {floor.level} FLOOR ⚡
                          </h3>
                          <ChevronRight
                            className={`w-7 h-7 text-white drop-shadow-lg transition-transform ${
                              expandedFloors[floorIndex] ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        {expandedFloors[floorIndex] && (
                          <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 p-4 bg-gradient-to-b ${colors.bg} to-slate-100 rounded-lg border-2 ${colors.bgBorder}`}>
                            <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                              <p className="text-sm font-bold mb-1">Floor Area</p>
                              <p className="text-2xl font-black">{floor.floor_area} m²</p>
                            </div>
                            <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                              <p className="text-sm font-bold mb-1">Bedrooms</p>
                              <p className="text-2xl font-black">{floor.bedrooms}</p>
                            </div>
                            <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                              <p className="text-sm font-bold mb-1">Bathrooms</p>
                              <p className="text-2xl font-black">{floor.bathrooms}</p>
                            </div>
                            <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                              <p className="text-sm font-bold mb-1">Lounges</p>
                              <p className="text-2xl font-black">{floor.lounges || 0}</p>
                            </div>
                            <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                              <p className="text-sm font-bold mb-1">Dining Areas</p>
                              <p className="text-2xl font-black">{floor.dining_areas || 0}</p>
                            </div>
                            {floor.notes && (
                              <div className="border-2 border-slate-400 rounded-lg p-3 text-center bg-white shadow-md">
                                <p className="text-sm font-bold mb-1">Notes</p>
                                <p className="text-xs">{floor.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Detailed Specifications */}
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Floor Area</p>
                      <p className="text-lg font-bold">{plan.floorArea} m²</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="text-lg font-bold">{plan.width}m × {plan.depth}m</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Levels</p>
                      <p className="text-lg font-bold">{plan.levels}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium">House</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Land Size</span>
                      <span className="font-medium">{plan.floorArea} m²</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Style</span>
                      <span className="font-medium">{plan.style.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{plan.isPopular ? 'Featured' : 'Available'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Property Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(plan.amenities || []).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <Card className="p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
              <p className="text-4xl font-bold text-primary mb-6">
                R{plan.price.toLocaleString()}
              </p>

              <Button 
                className="w-full mb-6" 
                size="lg"
                onClick={() => setShowBuyModal(true)}
              >
                Buy Plan
              </Button>

              {/* Quick Stats */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-semibold">{plan.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-semibold">{plan.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Garage</span>
                  <span className="font-semibold">{plan.garage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Floor Area</span>
                  <span className="font-semibold">{plan.floorArea} m²</span>
                </div>
              </div>
            </Card>

            {/* Share Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Share This Property</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">f</span>
                  Share on Facebook
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">𝕏</span>
                  Share on Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">in</span>
                  Share on LinkedIn
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Properties Section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <p className="text-muted-foreground">More properties will be displayed here based on similar criteria.</p>
        </div>
      </div>

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
                  onClick={() => setShowPaymentModal(true)}
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

      {/* Payment Details Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Payment Details</h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setShowBuyModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <p className="text-lg font-bold text-gray-900">{contactInfo.name || 'John Doe'}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-lg font-bold text-gray-900">{contactInfo.email || 'john@example.com'}</p>
                </div>

                <div className="border-t pt-4">
                  {/* Card Number */}
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, '');
                        value = value.replace(/(\d{4})/g, '$1 ').trim();
                        setPaymentInfo({ ...paymentInfo, cardNumber: value });
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentInfo.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentInfo({ ...paymentInfo, expiryDate: value });
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={3}
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">R{plan.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setShowSuccessModal(true);
                  }}
                >
                  Complete Purchase
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPaymentModal(false)}
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

      {/* Fullscreen Image Modal */}
      {showImageFullscreen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setShowImageFullscreen(false)}
        >
          <div 
            className="w-full h-full bg-black overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={plan.images[currentImageIndex]}
                alt={plan.title}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Info Bar */}
            <div className="bg-black/80 text-white px-6 py-4 flex items-center justify-between">
              <span className="text-lg font-semibold">{plan.title}</span>
              <span className="text-sm">{currentImageIndex + 1} / {plan.images.length}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowImageFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Video Modal */}
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
    </div>
  );
};

export default HouseDetails;
