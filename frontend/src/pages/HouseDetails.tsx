import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Maximize2,
  Play,
  BedDouble, 
  Bath, 
  Warehouse, 
  Layers, 
  Ruler, 
  CheckCircle2, 
  X,
  Building,
  MapPin,
   ArrowRight,
   Eye,
   EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_ENDPOINTS, BACKEND_URL } from '@/config/constants';
import { housePlans } from '@/data/housePlans';
import { builtHomes } from '@/data/builtHomes';

// Helper function to convert YouTube URLs to embed format
function convertYoutubeUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
  else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  }
  
  if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  return url;
}

export const HouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedFloors, setExpandedFloors] = useState<Record<number, boolean>>({ 0: true });
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ 
    name: '', 
    email: '', 
    phone: '',
      secretPassword: '',
      confirmPassword: '',
    province: '',
    city: '',
    pickupPoint: '',
    areaMall: ''
  });
   const [showSecretPassword, setShowSecretPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);
   const [missingFields, setMissingFields] = useState<Record<string, boolean>>({});
   const [phoneValidationError, setPhoneValidationError] = useState<string | null>(null);
   const [purchaseError, setPurchaseError] = useState<string | null>(null);
   const [showPurchaseErrorModal, setShowPurchaseErrorModal] = useState(false);
   const [purchaseErrorModalMessage, setPurchaseErrorModalMessage] = useState('');
   const secretPasswordInputRef = useRef<HTMLInputElement | null>(null);
   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   const [receiptPurchaseId, setReceiptPurchaseId] = useState<string | null>(null);
   const [showReceiptBanner, setShowReceiptBanner] = useState(false);
   const [isReceiptLoading, setIsReceiptLoading] = useState(false);
   const [receiptError, setReceiptError] = useState<string | null>(null);
   const hasTriggeredReceiptFlow = useRef(false);

  // Fetch plan from API
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PLAN_DETAIL(id));
        if (response.ok) {
          const planData = await response.json();
          const allImages = [
            ...(planData.images?.map((img: any) => img.image || img.image_url) || []),
            ...(planData.primary_image ? [planData.primary_image] : [])
          ].filter(img => img);
          
          const images = allImages.length > 0 ? allImages : ['https://via.placeholder.com/600x400'];

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
            amenties: planData.amenities?.map((a: any) => a.name) || [],
            floors: planData.floors || [],
            propertyType: planData.property_type,
            landSize: planData.land_size,
            status: planData.status
          };
          setPlan(transformedPlan);
        } else {
          const staticPlan = housePlans.find((p) => p.id === id) || builtHomes.find((p) => p.id === id);
          setPlan(staticPlan || null);
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
        const staticPlan = housePlans.find((p) => p.id === id) || builtHomes.find((p) => p.id === id);
        setPlan(staticPlan || null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const purchaseId = params.get('purchase_id');
      const checkout = params.get('checkout');
      if (!purchaseId) return;

      setReceiptPurchaseId(purchaseId);
      setShowReceiptBanner(checkout === 'success');

      const syncStatus = async () => {
         try {
            await fetch(`${BACKEND_URL}/api/purchase/${purchaseId}/sync/`);
         } catch (error) {
            console.error('Failed to sync purchase status:', error);
         }
      };

      syncStatus();
   }, []);

   const handleDownloadReceipt = async () => {
      if (!receiptPurchaseId) return;
      setIsReceiptLoading(true);
      setReceiptError(null);
      try {
         const response = await fetch(`${BACKEND_URL}/api/purchase/${receiptPurchaseId}/receipt-link/`);
         const data = await response.json();
         if (!response.ok || !data.url) {
            throw new Error(data.detail || 'Unable to generate receipt');
         }
         window.location.href = data.url;
      } catch (error) {
         console.error('Receipt error:', error);
         setReceiptError('Unable to generate receipt. Please try again.');
      } finally {
         setIsReceiptLoading(false);
      }
   };

   const buildWhatsappMessage = (summary: any) => {
      const pickupText = summary.pick_up_point
         ? `Pickup: ${summary.pick_up_point}${summary.area_mall ? ` (${summary.area_mall})` : ''}`
         : '';
      return (
         `Hello, I have completed a purchase. My purchase ID is ${summary.receipt_id}. Please assist with proof of payment on WhatsApp.\n\n` +
         `Bill To:\n${summary.full_name}\n${summary.email}\n${summary.phone_number}` +
         `${summary.province ? `\nProvince: ${summary.province}` : ''}` +
         `${pickupText ? `\n${pickupText}` : ''}` +
         `\nAccess your house plan here: ${summary.plan_url}\n\n` +
         `Item Description\n` +
         `Receipt ID: ${summary.receipt_id}\n` +
         `Date: ${summary.date}\n` +
         `Status: ${summary.status}\n` +
         `Type\nPrice\n` +
         `${summary.plan_title}\n` +
         `Design #${summary.plan_id}\n` +
         `${summary.plan_type}\n` +
         `R ${summary.plan_price}`
      );
   };

   useEffect(() => {
      if (!showReceiptBanner || !receiptPurchaseId || hasTriggeredReceiptFlow.current) return;
      hasTriggeredReceiptFlow.current = true;

      const runWhatsappFlow = async () => {
         const whatsappNumber = '27726659790';
         let message = `Hello, I have completed a purchase. My purchase ID is ${receiptPurchaseId}. Please assist with proof of payment on WhatsApp.`;
         try {
            const response = await fetch(`${BACKEND_URL}/api/purchase/${receiptPurchaseId}/summary/`);
            if (response.ok) {
               const summary = await response.json();
               message = buildWhatsappMessage(summary);
            }
         } catch (error) {
            console.error('Failed to load purchase summary:', error);
         }

         const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
         window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

         setTimeout(() => {
            handleDownloadReceipt();
         }, 800);
      };

      runWhatsappFlow();
   }, [showReceiptBanner, receiptPurchaseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading Architecture...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="text-center py-20 px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-8">The architectural design you are looking for is currently unavailable.</p>
          <Button onClick={() => navigate('/house-plans')} size="lg">Return to Collection</Button>
        </div>
      </div>
    );
  }

  const toggleFloor = (floorNumber: number) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorNumber]: !prev[floorNumber]
    }));
  };

    const normalizePhone = (value: string) => value.replace(/\D/g, '');

   const handlePurchaseErrorOk = () => {
      setShowPurchaseErrorModal(false);
      setShowBuyModal(true);
      requestAnimationFrame(() => {
         secretPasswordInputRef.current?.focus();
      });
   };

  const propertyFeatures = [
    { label: 'Bedrooms', value: plan.bedrooms, icon: BedDouble },
    { label: 'Bathrooms', value: plan.bathrooms, icon: Bath },
    { label: 'Garage', value: plan.garage, icon: Warehouse },
    { label: 'Levels', value: plan.levels, icon: Layers },
    { label: 'Floor Area', value: `${plan.floorArea} m²`, icon: Ruler },
  ];

   const handleCheckoutPayment = async () => {
      setIsProcessingPayment(true);
      try {
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
                           secret_password: contactInfo.secretPassword,
            })
         });

         const purchaseData = await purchaseResponse.json();
         if (!purchaseData.id) {
            const errorMessage = purchaseData.error || purchaseData.detail || 'Error creating purchase. Please try again.';
            setPurchaseError(errorMessage);
            setPurchaseErrorModalMessage(errorMessage);
            setShowPurchaseErrorModal(true);
            return;
         }

         const purchaseIdentifier = purchaseData.public_id || purchaseData.id;
         setShowBuyModal(false);
         const origin = window.location.origin;
         const basePath = `${origin}/house-details/${plan.id}`;
         const successReturnUrl = `${basePath}?checkout=success&purchase_id=${purchaseIdentifier}`;
         const cancelReturnUrl = `${basePath}?checkout=cancel&purchase_id=${purchaseIdentifier}`;
         const failureReturnUrl = `${basePath}?checkout=failure&purchase_id=${purchaseIdentifier}`;

         const backendUrl = 'https://cedricmunyanihouseplan-backend.onrender.com';
         const successUrl = `${backendUrl}/api/purchase/${purchaseIdentifier}/success/?return_url=${encodeURIComponent(successReturnUrl)}`;
         const cancelUrl = `${backendUrl}/api/purchase/${purchaseIdentifier}/cancel/?return_url=${encodeURIComponent(cancelReturnUrl)}`;
         const failureUrl = `${backendUrl}/api/purchase/${purchaseIdentifier}/failure/?return_url=${encodeURIComponent(failureReturnUrl)}`;

         const checkoutResponse = await fetch(`https://cedricmunyanihouseplan-backend.onrender.com/api/create-checkout/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               purchase_id: purchaseIdentifier,
               success_url: successUrl,
               cancel_url: cancelUrl,
               failure_url: failureUrl,
            })
         });

         const checkoutData = await checkoutResponse.json();
         if (checkoutData.success && checkoutData.redirect_url) {
            window.location.href = checkoutData.redirect_url;
         } else {
            alert('Payment initialization failed. Please try again.');
         }
      } catch (error) {
         console.error('Payment error:', error);
         alert('Payment processing error. Please try again.');
      } finally {
         setIsProcessingPayment(false);
      }
   };

   return (
      <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
         <Header />
         {showReceiptBanner && receiptPurchaseId && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900">
               <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                     <p className="font-semibold">Payment confirmed.</p>
                     <p className="text-sm">Download your receipt for your records.</p>
                     {receiptError && <p className="text-sm text-red-600">{receiptError}</p>}
                  </div>
                  <Button
                     size="sm"
                     onClick={handleDownloadReceipt}
                     disabled={isReceiptLoading}
                  >
                     {isReceiptLoading ? 'Preparing...' : 'Download Receipt'}
                  </Button>
               </div>
            </div>
         )}
      
      {/* Immersive Hero Header - Clickable for Fullscreen */}
      <div 
        className="relative h-[60vh] min-h-[500px] w-full overflow-hidden cursor-pointer group"
        onClick={() => setShowImageFullscreen(true)}
      >
        <div 
           className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
           style={{ backgroundImage: `url(${plan.images[currentImageIndex]})` }}
        />
        {/* Dark gradient overlay to ensure text visibility in both light and dark modes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-32">
          <div className="container px-4">
            <Button 
                variant="outline" 
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="mb-8 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-3">
                  {plan.isNew && (
                    <Badge className="bg-blue-500/80 backdrop-blur-md text-white border-none py-1.5 px-3">New Arrival</Badge>
                  )}
                  {plan.isPopular && (
                    <Badge className="bg-amber-500/80 backdrop-blur-md text-white border-none py-1.5 px-3">Bestseller</Badge>
                  )}
                  <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md py-1.5 px-3 uppercase tracking-wider text-xs">
                    {plan.propertyType || 'Modern Villa'}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg max-w-3xl">
                  {plan.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-200">
                   <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">Design Code: #{plan.id}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-primary" />
                      <span className="font-medium">{plan.width}m x {plan.depth}m</span>
                   </div>
                </div>
              </div>

               <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                 {plan.videoUrl && (
                    <Button 
                      size="lg"
                      onClick={(e) => { e.stopPropagation(); setShowVideo(true); }}
                      className="bg-red-600/90 hover:bg-red-600 text-white rounded-full px-6 backdrop-blur-sm border border-red-500/20 shadow-xl"
                    >
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Watch Video
                    </Button>
                 )}
                 <Button 
                    size="lg"
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); setShowImageFullscreen(true); }}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-6 backdrop-blur-md shadow-xl"
                 >
                   <Maximize2 className="w-5 h-5 mr-2" />
                   View Photos
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-20 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Strip */}
            <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-sm overflow-hidden">
               <CardContent className="p-4">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                     {plan.images.map((image: string, index: number) => (
                        <div 
                           key={index}
                           onClick={() => setCurrentImageIndex(index)}
                           className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                              index === currentImageIndex ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
                           }`}
                        >
                           <img src={image} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
               {propertyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const isLevels = feature.label === 'Levels';
                  
                  return (
                    <div 
                      key={index} 
                      onClick={() => {
                        if (isLevels && plan.floors?.length > 0) {
                           document.getElementById('floor-layouts')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`bg-card border border-border/50 p-4 rounded-xl text-center shadow-sm transition-all group ${
                        isLevels && plan.floors?.length > 0 
                           ? 'cursor-pointer hover:border-primary hover:shadow-md hover:bg-primary/5 ring-primary/20' 
                           : 'hover:shadow-md'
                      }`}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-110 transition-transform">
                         <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">{feature.label}</p>
                      <p className="text-lg font-bold text-foreground">{feature.value}</p>
                      {isLevels && plan.floors?.length > 0 && (
                         <p className="text-[10px] text-primary font-medium mt-1 animate-pulse">View Layouts</p>
                      )}
                    </div>
                  );
               })}
            </div>

            {/* Description Card */}
            <Card className="border-border/50 shadow-sm">
               <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">About this Design</h2>
                  <div className={`prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed ${!showFullDescription && 'line-clamp-4'}`}>
                     {plan.description || "A masterpiece of modern architectural design, featuring open-plan living spaces designed to maximize natural light and airflow. Every detail has been carefully considered to provide both luxury and functionality for the modern family."}
                  </div>
                  {plan.description && plan.description.length > 200 && (
                     <Button 
                        variant="link" 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 h-auto p-0 font-semibold text-primary"
                     >
                        {showFullDescription ? "Show Less" : "Read Full Description"}
                     </Button>
                  )}

                  {plan.amenities && plan.amenities.length > 0 && (
                     <div className="mt-8 pt-8 border-t border-border/50">
                        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                           {plan.amenities.map((amenity: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-sm text-foreground/80">
                                 <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                 {amenity}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Floor Breakdown - Enhanced Visibility */}
            {plan.floors && plan.floors.length > 0 && (
               <div id="floor-layouts" className="space-y-6 scroll-mt-24">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold">Floor Layouts & Rooms</h2>
                     <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                        {plan.floors.length} Levels
                     </Badge>
                  </div>
                  
                  {plan.floors.map((floor: any, idx: number) => (
                     <div 
                        key={idx} 
                        className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${
                           expandedFloors[idx] 
                              ? 'border-primary shadow-lg ring-1 ring-primary/20' 
                              : 'border-border/50 shadow-sm hover:border-primary/50'
                        }`}
                     >
                        <button
                           onClick={() => toggleFloor(idx)}
                           className={`w-full flex items-center justify-between p-6 transition-colors ${
                              expandedFloors[idx] ? 'bg-primary/5' : 'bg-transparent hover:bg-muted/30'
                           }`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors ${
                                 expandedFloors[idx] ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                              }`}>
                                 {floor.level?.charAt(0) || idx + 1}
                              </div>
                              <div className="text-left">
                                 <h3 className={`font-bold text-lg ${expandedFloors[idx] ? 'text-primary' : 'text-foreground'}`}>
                                    {floor.level || `Level ${idx + 1}`}
                                 </h3>
                                 <p className="text-sm text-muted-foreground">
                                    {floor.floor_area ? `${floor.floor_area} m²` : ' Detailed Layout'}
                                 </p>
                              </div>
                           </div>
                           <div className={`p-2 rounded-full transition-all duration-300 ${
                              expandedFloors[idx] ? 'bg-primary/20 text-primary rotate-180' : 'bg-muted text-muted-foreground'
                           }`}>
                              <ChevronRight className="w-5 h-5" />
                           </div>
                        </button>
                        
                        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                           expandedFloors[idx] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}>
                           <div className="overflow-hidden">
                              <div className="p-6 pt-0 border-t border-border/10">
                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                    {[
                                       { label: "Bedrooms", val: floor.bedrooms, icon: BedDouble },
                                       { label: "Bathrooms", val: floor.bathrooms, icon: Bath },
                                       { label: "Lounges", val: floor.lounges, icon: Layers },
                                       { label: "Dining", val: floor.dining_areas, icon: Warehouse }
                                    ].filter(stat => stat.val !== undefined).map((stat, i) => (
                                       <div key={i} className="bg-background rounded-xl p-4 text-center border border-border shadow-sm">
                                          <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary/60" />
                                          <div className="text-2xl font-bold text-foreground">{stat.val}</div>
                                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
                                       </div>
                                    ))}
                                 </div>
                                 {floor.notes && (
                                    <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-sm text-muted-foreground border border-blue-100 dark:border-blue-900/50 flex gap-3">
                                       <div className="w-1 bg-blue-400 rounded-full" />
                                       <p>"{floor.notes}"</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </div>

          {/* Sidebar - Sticky booking widget */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <Card className="border-border/50 shadow-2xl overflow-hidden">
                   <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
                   <CardContent className="p-6">
                      <div className="mb-6">
                         <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Starting From</span>
                         <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-4xl font-bold text-foreground">R{plan.price.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">ZAR</span>
                         </div>
                      </div>

                      <div className="space-y-3 mb-6">
                         <Button 
                           className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/25" 
                           onClick={() => setShowBuyModal(true)}
                         >
                            Purchase Plan Now
                         </Button>
                         <Button 
                           variant="outline" 
                           className="w-full h-12"
                           onClick={() => navigate('/contact')} 
                         >
                            Request Customization
                         </Button>
                      </div>
                      
                      <div className="text-center">
                         <p className="text-xs text-muted-foreground mb-4">Secure payment via Yoco or Card</p>
                         <div className="flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                         </div>
                      </div>
                   </CardContent>
                   <div className="bg-muted/50 p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                      <button 
                         onClick={() => setIsFavorite(!isFavorite)}
                         className="flex items-center gap-2 hover:text-red-500 transition-colors"
                      >
                         <Heart className={`w-4 h-4 ${isFavorite && 'fill-red-500 text-red-500'}`} /> Save
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                         <Share2 className="w-4 h-4" /> Share
                      </button>
                   </div>
                </Card>

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                   <h3 className="font-semibold text-blue-600 mb-2">Need Help?</h3>
                   <p className="text-sm text-muted-foreground mb-4">
                      Not sure if this plan fits your plot? Talk to our architects for free advice.
                   </p>
                   <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => navigate('/contact')}>
                      Contact Support <ArrowRight className="w-4 h-4 ml-1" />
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Fullscreen Modal */}
      {showImageFullscreen && (
        <div 
           className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300"
           onClick={() => setShowImageFullscreen(false)}
        >
           <div className="flex justify-between items-center p-4 text-white">
              <span className="font-medium text-lg">{plan.title} - Gallery ({currentImageIndex + 1}/{plan.images.length})</span>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 rounded-full">
                 <X className="w-6 h-6" />
              </Button>
           </div>
           
           <div className="flex-1 relative flex items-center justify-center p-4 md:p-10">
              <img 
                 src={plan.images[currentImageIndex]} 
                 alt="Fullscreen view" 
                 className="max-w-full max-h-full object-contain shadow-2xl"
                 onClick={e => e.stopPropagation()}
              />
              
              <button 
                 onClick={e => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === 0 ? plan.images.length - 1 : prev - 1)); }}
                 className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                 <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button 
                 onClick={e => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === plan.images.length - 1 ? 0 : prev + 1)); }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                 <ChevronRight className="w-8 h-8" />
              </button>
           </div>
           
           <div className="h-20 bg-black/50 p-2 flex justify-center gap-2 overflow-x-auto">
              {plan.images.map((img: string, idx: number) => (
                 <div 
                    key={idx} 
                    onClick={e => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`h-full aspect-square rounded cursor-pointer overflow-hidden border-2 ${idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                 >
                    <img src={img} className="w-full h-full object-cover" />
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && (
         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
               <iframe
                  width="100%"
                  height="100%"
                  src={convertYoutubeUrl(plan.videoUrl)}
                  title={plan.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
               />
               <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                  <X className="w-8 h-8" />
               </button>
            </div>
         </div>
      )}

      {/* Buy Modal - Yoco Style */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
           <Card className="w-full max-w-lg border-2 border-primary/20 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col">
              <div className="relative shrink-0 h-32 bg-primary/10 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20" />
                 <div className="absolute bottom-4 left-6">
                    <h2 className="text-2xl font-bold">Purchase {plan.title}</h2>
                    <p className="text-sm text-muted-foreground">{plan.bedrooms} BEDROOMS</p>
                 </div>
                 <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background rounded-full transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <CardContent className="p-6 space-y-6 overflow-y-auto">
                 <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl border border-border/50">
                    <div>
                       <p className="font-semibold">Plan Price</p>
                    </div>
                    <p className="text-xl font-bold text-primary">R{plan.price.toLocaleString()}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">Contact Information</h3>
                    
                    <div className="space-y-2">
                       <Label>Your Name</Label>
                       <Input 
                             placeholder="Enter your full name" 
                             value={contactInfo.name}
                                           onChange={e => {
                                              setContactInfo({...contactInfo, name: e.target.value});
                                              if (missingFields.name) {
                                                 setMissingFields({ ...missingFields, name: false });
                                              }
                                           }}
                                           className={missingFields.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                       />
                    </div>

                    <div className="space-y-2">
                       <Label>Your Email</Label>
                       <Input 
                          type="email" 
                          placeholder="Enter your email address" 
                          value={contactInfo.email}
                                       onChange={e => {
                                          setContactInfo({...contactInfo, email: e.target.value});
                                          if (missingFields.email) {
                                             setMissingFields({ ...missingFields, email: false });
                                          }
                                       }}
                                       className={missingFields.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                       />
                    </div>

                    <div className="space-y-2">
                       <Label>Phone</Label>
                       <Input 
                          placeholder="e.g 0726659790" 
                          value={contactInfo.phone}
                                       onChange={e => {
                                         const normalizedPhone = normalizePhone(e.target.value);
                                         setContactInfo({...contactInfo, phone: normalizedPhone});
                                          if (missingFields.phone) {
                                             setMissingFields({ ...missingFields, phone: false });
                                          }
                                          if (normalizedPhone.length === 0) {
                                             setPhoneValidationError(null);
                                          } else if (normalizedPhone.length !== 10) {
                                             setPhoneValidationError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
                                          } else {
                                             setPhoneValidationError(null);
                                          }
                                       }}
                                       onBlur={() => {
                                          if (contactInfo.phone && contactInfo.phone.length !== 10) {
                                             setPhoneValidationError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
                                          }
                                       }}
                                       className={missingFields.phone || phoneValidationError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                       />
                       {phoneValidationError && (
                          <p className="text-sm text-red-600">{phoneValidationError}</p>
                       )}
                    </div>

                    <div className="space-y-2">
                       <Label>Secret Password</Label>
                       <p className="text-xs text-red-500 font-medium mt-1">This secret password is required to download your payment receipt. Please keep it safe.</p>
                       <div className="relative">
                          <Input 
                             type={showSecretPassword ? 'text' : 'password'}
                             placeholder="Enter secret password" 
                             value={contactInfo.secretPassword}
                             onChange={e => {
                               const nextValue = e.target.value;
                               const nextConfirm = contactInfo.confirmPassword;
                               setContactInfo({...contactInfo, secretPassword: nextValue});
                                              if (missingFields.secretPassword) {
                                                 setMissingFields({ ...missingFields, secretPassword: false });
                                              }
                               if (nextConfirm) {
                                 setShowPasswordMismatch(nextValue !== nextConfirm);
                               }
                             }}
                             onBlur={() => {
                               if (contactInfo.confirmPassword) {
                                 setShowPasswordMismatch(contactInfo.secretPassword !== contactInfo.confirmPassword);
                               }
                             }}
                                           className={`pr-10 ${missingFields.secretPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                             ref={secretPasswordInputRef}
                          />
                          <button
                             type="button"
                             onClick={() => setShowSecretPassword((prev) => !prev)}
                             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                             aria-label={showSecretPassword ? 'Hide password' : 'Show password'}
                          >
                             {showSecretPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label>Confirm Password</Label>
                       <div className="relative">
                          <Input 
                             type={showConfirmPassword ? 'text' : 'password'}
                             placeholder="Confirm secret password" 
                             value={contactInfo.confirmPassword}
                             onChange={e => {
                               const nextValue = e.target.value;
                               const nextSecret = contactInfo.secretPassword;
                               setContactInfo({...contactInfo, confirmPassword: nextValue});
                                              if (missingFields.confirmPassword) {
                                                 setMissingFields({ ...missingFields, confirmPassword: false });
                                              }
                               if (nextSecret) {
                                 setShowPasswordMismatch(nextSecret !== nextValue);
                               }
                             }}
                             onBlur={() => {
                               if (contactInfo.secretPassword) {
                                 setShowPasswordMismatch(contactInfo.secretPassword !== contactInfo.confirmPassword);
                               }
                             }}
                                           className={`pr-10 ${missingFields.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          <button
                             type="button"
                             onClick={() => setShowConfirmPassword((prev) => !prev)}
                             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                             aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                             {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                       {showPasswordMismatch && (
                          <p className="text-sm text-red-600">Passwords do not match.</p>
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Province</Label>
                          <Input 
                             placeholder="e.g. Gauteng" 
                             value={contactInfo.province}
                             onChange={e => {
                               setContactInfo({...contactInfo, province: e.target.value});
                               if (missingFields.province) {
                                 setMissingFields({ ...missingFields, province: false });
                               }
                             }}
                             className={missingFields.province ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label>City</Label>
                          <Input 
                             placeholder="e.g. Johannesburg" 
                             value={contactInfo.city}
                             onChange={e => {
                               setContactInfo({...contactInfo, city: e.target.value});
                               if (missingFields.city) {
                                 setMissingFields({ ...missingFields, city: false });
                               }
                             }}
                             className={missingFields.city ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <Label>Pick-up Point</Label>
                        <Input 
                          placeholder="e.g. PostNet or Pep Store" 
                          value={contactInfo.pickupPoint}
                                       onChange={e => {
                                          setContactInfo({...contactInfo, pickupPoint: e.target.value});
                                          if (missingFields.pickupPoint) {
                                             setMissingFields({ ...missingFields, pickupPoint: false });
                                          }
                                       }}
                                       className={missingFields.pickupPoint ? 'border-red-500 focus-visible:ring-red-500' : ''}
                       />
                    </div>

                    <div className="space-y-2">
                       <Label>Area / Mall</Label>
                        <Input 
                          placeholder="e.g. Sandton City" 
                          value={contactInfo.areaMall}
                                       onChange={e => {
                                          setContactInfo({...contactInfo, areaMall: e.target.value});
                                          if (missingFields.areaMall) {
                                             setMissingFields({ ...missingFields, areaMall: false });
                                          }
                                       }}
                                       className={missingFields.areaMall ? 'border-red-500 focus-visible:ring-red-500' : ''}
                       />
                    </div>
                 </div>

                         {Object.values(missingFields).some(Boolean) && (
                              <p className="text-sm text-red-600">Please fill in all required fields.</p>
                         )}
                        {purchaseError && (
                           <p className="text-sm text-red-600">{purchaseError}</p>
                        )}

                 <div className="flex gap-3 pt-2">
                    <Button 
                     size="lg"
                     className="flex-1 text-base font-semibold" 
                     onClick={() => {
                                  setShowPurchaseErrorModal(false);
                                  setPurchaseError(null);
                                  const nextMissing: Record<string, boolean> = {};
                                  if (!contactInfo.name) nextMissing.name = true;
                                  if (!contactInfo.email) nextMissing.email = true;
                                  if (!contactInfo.phone) nextMissing.phone = true;
                                  if (!contactInfo.secretPassword) nextMissing.secretPassword = true;
                                  if (!contactInfo.confirmPassword) nextMissing.confirmPassword = true;
                                  if (!contactInfo.province) nextMissing.province = true;
                                  if (!contactInfo.city) nextMissing.city = true;
                                  if (!contactInfo.pickupPoint) nextMissing.pickupPoint = true;
                                  if (!contactInfo.areaMall) nextMissing.areaMall = true;
                                  setMissingFields(nextMissing);
                                  if (Object.keys(nextMissing).length > 0) {
                                     return;
                                  }
                                  if (contactInfo.phone.length !== 10) {
                                     setPhoneValidationError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
                                     return;
                                  }
                                  if (contactInfo.secretPassword !== contactInfo.confirmPassword) {
                                     setShowPasswordMismatch(true);
                                     alert('Passwords do not match');
                                     return;
                                  }
                       setShowBuyModal(false);
                       handleCheckoutPayment();
                     }}
                    >
                       Proceed to Payment <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button 
                     variant="outline"
                     size="lg"
                     className="flex-1 text-base"
                     onClick={() => setShowBuyModal(false)}
                    >
                       Cancel
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}

         {showPurchaseErrorModal && (
            <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
               <Card className="w-full max-w-md bg-white">
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Action Required</h3>
                        <button
                           onClick={handlePurchaseErrorOk}
                           className="text-gray-500 hover:text-gray-700"
                           aria-label="Close error modal"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                     <p className="text-sm text-red-600">{purchaseErrorModalMessage}</p>
                     <div className="mt-6 flex justify-end">
                        <Button
                           size="sm"
                           onClick={handlePurchaseErrorOk}
                        >
                           Ok
                        </Button>
                     </div>
                  </div>
               </Card>
            </div>
         )}

         {isProcessingPayment && (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
               <Card className="w-full max-w-md bg-white">
                  <div className="p-6 space-y-5">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Connecting to Yoco</h3>
                        <span className="text-xs text-muted-foreground">Secure checkout</span>
                     </div>
                     <Skeleton className="h-6 w-3/4" />
                     <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-4 w-2/3" />
                     <div className="pt-2">
                        <Skeleton className="h-10 w-full" />
                     </div>
                     <p className="text-xs text-muted-foreground text-center">Please wait while we prepare your payment.</p>
                  </div>
               </Card>
            </div>
         )}
    </div>
  );
};
export default HouseDetails;
