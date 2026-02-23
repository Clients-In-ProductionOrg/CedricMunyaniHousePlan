import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, List, Heart, Home, Bed, Bath, Car, Search, X, ChevronDown, ChevronUp, SlidersHorizontal, Square, ArrowRight, Share2, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ENDPOINTS, BACKEND_URL } from '@/config/constants';
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptLookup, setReceiptLookup] = useState({ phone: '', secretPassword: '' });
  const [receiptLookupError, setReceiptLookupError] = useState<string | null>(null);
  const [isReceiptLookupLoading, setIsReceiptLookupLoading] = useState(false);
  const [showReceiptPassword, setShowReceiptPassword] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
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
  const [paymentInfo, setPaymentInfo] = useState({ 
    cardNumber: '', 
    expiryDate: '', 
    cvv: '' 
  });

  // Payment handler using Yoco Checkout API
  const handleCheckoutPayment = async (plan: HousePlan) => {
    setIsProcessingPayment(true);
    try {
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
      const successReturnUrl = `${origin}/house-plans?checkout=success&purchase_id=${purchaseIdentifier}`;
      const cancelReturnUrl = `${origin}/house-plans?checkout=cancel&purchase_id=${purchaseIdentifier}`;
      const failureReturnUrl = `${origin}/house-plans?checkout=failure&purchase_id=${purchaseIdentifier}`;

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

  const handleOpenGallery = () => {
    console.log(`Opening gallery for ${plan.title}`, {
      totalImages: plan.images.length,
      images: plan.images
    });
    setIsGalleryOpen(true);
  };

  const normalizePhone = (value: string) => value.replace(/\D/g, '');

  const handlePurchaseErrorOk = () => {
    setShowPurchaseErrorModal(false);
    setShowBuyModal(true);
    requestAnimationFrame(() => {
      secretPasswordInputRef.current?.focus();
    });
  };

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setReceiptLookup({ phone: '', secretPassword: '' });
    setReceiptLookupError(null);
    setShowReceiptModal(true);
  };

  const handleReceiptLookup = async () => {
    if (!receiptLookup.phone || !receiptLookup.secretPassword) {
      setReceiptLookupError('Please enter your phone number and secret password.');
      return;
    }

    setIsReceiptLookupLoading(true);
    setReceiptLookupError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/purchase/receipt-lookup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: receiptLookup.phone,
          secret_password: receiptLookup.secretPassword,
          return_path: `${window.location.pathname}${window.location.search}`,
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.detail || 'Unable to download receipt.');
      }

      setShowReceiptModal(false);
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Receipt lookup error:', error);
      setReceiptLookupError(error?.message || 'Unable to download receipt.');
    } finally {
      setIsReceiptLookupLoading(false);
    }
  };

  const handleForgotSecretPassword = async () => {
    if (!receiptLookup.phone) {
      setReceiptLookupError('Please enter your phone number first.');
      return;
    }
    if (receiptLookup.phone.length !== 10) {
      setReceiptLookupError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
      return;
    }

    setIsForgotPasswordLoading(true);
    setReceiptLookupError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/purchase/phone-summary/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: receiptLookup.phone,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Unable to find your purchase details.');
      }

      const message = (
        `Hello, I forgot my secret password for my house plan purchase. Please assist me based on my cellphone number.\n\n` +
        `Full Name: ${data.full_name}\n` +
        `Phone: ${data.phone_number}\n` +
        `Email: ${data.email}\n` +
        `Plan: ${data.plan_title}\n` +
        `Price: R ${data.plan_price}\n` +
        `Plan Link: ${data.plan_url}`
      );

      const whatsappUrl = `https://wa.me/27726659790?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;
    } catch (error: any) {
      setReceiptLookupError(error?.message || 'Unable to find your purchase details.');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleShareLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const shareUrl = `${window.location.origin}/house-details/${plan.id}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: plan.title, url: shareUrl });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied');
        return;
      }
      window.prompt('Copy share link:', shareUrl);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Unable to share the link. Please try again.');
    }
  };

  return (
    <>
      <div
        id={`plan-${plan.id}`}
        className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-shadow duration-500"
      >
        <div 
          className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
          onClick={handleOpenGallery}
        >
          <img
            src={plan.images[currentImageIndex]}
            alt={plan.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white font-medium drop-shadow-md">View {plan.images.length} Photos</span>
             </div>
          </div>
          
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {plan.isNew && (
              <Badge className="bg-blue-500/90 backdrop-blur-md text-white border-none shadow-lg">New Arrival</Badge>
            )}
            {plan.isPopular && (
              <Badge className="bg-amber-500/90 backdrop-blur-md text-white border-none shadow-lg">Popular</Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-10 group/heart"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white group-hover/heart:text-red-500'
              )}
            />
          </button>

          {plan.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {plan.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    'h-1.5 rounded-full transition-all shadow-sm',
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/40 w-1.5 hover:bg-white/60'
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

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {plan.title}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                     <Home className="w-3.5 h-3.5" /> 
                     {plan.propertyType || "Modern Home"}
                  </p>
                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
                    aria-label="Copy share link"
                    title="Copy share link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
                    aria-label="Download plan payment receipt"
                    title="Download plan payment receipt"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
             </div>
             <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Price</p>
                <div className="text-2xl font-bold text-primary">
                  R{plan.price.toLocaleString()}
                </div>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 py-4 border-y border-border/40">
             <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-secondary/30 text-center hover:bg-secondary/50 transition-colors">
                <Square className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{plan.floorArea}m²</span>
                <span className="text-[10px] text-muted-foreground">Area</span>
             </div>
             <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-secondary/30 text-center hover:bg-secondary/50 transition-colors">
                <Bed className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{plan.bedrooms}</span>
                <span className="text-[10px] text-muted-foreground">Beds</span>
             </div>
             <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-secondary/30 text-center hover:bg-secondary/50 transition-colors">
                <Bath className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{plan.bathrooms}</span>
                <span className="text-[10px] text-muted-foreground">Baths</span>
             </div>
             <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-secondary/30 text-center hover:bg-secondary/50 transition-colors">
                <Car className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{plan.garage}</span>
                <span className="text-[10px] text-muted-foreground">Garage</span>
             </div>
          </div>
          
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {plan.width}m Width
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {plan.depth}m Depth
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button 
              variant="outline"
              className="w-full rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary font-semibold" 
              onClick={() => navigate(`/house-details/${plan.id}`)}
            >
              Details
            </Button>
            {plan.videoUrl ? (
               <Button 
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 font-semibold gap-2"
                onClick={() => setShowVideo(true)}
               >
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 Watch Video
               </Button>
            ) : (
               <Button 
                className="w-full rounded-xl font-semibold shadow-lg shadow-primary/25"
                onClick={() => setShowBuyModal(true)}
               >
                 Buy Plan
               </Button>
            )}
          </div>
          
          {plan.videoUrl && (
             <Button 
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20"
              onClick={() => setShowBuyModal(true)}
             >
               Buy Plan Online
             </Button>
          )}
        </div>
      </div>

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

        {showReceiptModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-md border-2 border-primary/20 shadow-2xl animate-in zoom-in-95">
              <div className="relative shrink-0 h-20 bg-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20" />
                <div className="absolute bottom-3 left-6">
                  <h2 className="text-xl font-bold">Download Receipt</h2>
                  <p className="text-sm text-muted-foreground">Enter your purchase details</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="absolute top-3 right-3 p-2 bg-background/50 hover:bg-background rounded-full transition-colors"
                  aria-label="Close receipt modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    placeholder="e.g 0726659790"
                    value={receiptLookup.phone}
                    onChange={(e) => setReceiptLookup({ ...receiptLookup, phone: normalizePhone(e.target.value) })}
                  />
                  <p className="text-xs text-red-500 font-medium">Enter the phone number used for the purchase.</p>
                </div>
                <div className="space-y-2">
                  <Label>Secret Password</Label>
                  <div className="relative">
                    <Input
                      type={showReceiptPassword ? 'text' : 'password'}
                      placeholder="Secret Password"
                      value={receiptLookup.secretPassword}
                      onChange={(e) => setReceiptLookup({ ...receiptLookup, secretPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowReceiptPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showReceiptPassword ? 'Hide password' : 'Show password'}
                    >
                      {showReceiptPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-red-500 font-medium">Enter the secret password used for the house plan purchase.</p>
                  <button
                    type="button"
                    onClick={handleForgotSecretPassword}
                    disabled={isForgotPasswordLoading}
                    className="text-xs text-primary font-semibold hover:underline disabled:text-muted-foreground"
                  >
                    {isForgotPasswordLoading ? 'Requesting help...' : 'Forgotten secret password?'}
                  </button>
                </div>
                {receiptLookupError && (
                  <p className="text-sm text-red-600">{receiptLookupError}</p>
                )}
                {isReceiptLookupLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    Creating payment receipt...
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleReceiptLookup}
                    disabled={isReceiptLookupLoading}
                    className="text-primary font-semibold hover:underline disabled:text-muted-foreground"
                  >
                    {isReceiptLookupLoading ? 'Preparing...' : 'Dowload receipt'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}



      {/* Buy Plan Modal - Yoco Style */}
      {showBuyModal && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
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
                              onChange={(e) => {
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
                         onChange={(e) => {
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
                         onChange={(e) => {
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
                         onChange={(e) => {
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
                         onChange={(e) => {
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
                           onChange={(e) => {
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
                           onChange={(e) => {
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
                         onChange={(e) => {
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
                         onChange={(e) => {
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
                      setPurchaseError(null);
                      setShowPurchaseErrorModal(false);
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
                        handleCheckoutPayment(plan);
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
                  setContactInfo({ name: '', email: '', phone: '', secretPassword: '', confirmPassword: '', province: '', city: '', pickupPoint: '', areaMall: '' });
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
  const CACHE_KEY = 'house-plans-catalog-v1';
  const CACHE_TTL_MS = 5 * 60 * 1000;
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
  const [receiptPurchaseId, setReceiptPurchaseId] = useState<string | null>(null);
  const [showReceiptBanner, setShowReceiptBanner] = useState(false);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [showGlobalReceiptModal, setShowGlobalReceiptModal] = useState(false);
  const [globalReceiptLookup, setGlobalReceiptLookup] = useState({ phone: '', secretPassword: '' });
  const [globalReceiptError, setGlobalReceiptError] = useState<string | null>(null);
  const [isGlobalReceiptLoading, setIsGlobalReceiptLoading] = useState(false);
  const [showGlobalReceiptPassword, setShowGlobalReceiptPassword] = useState(false);
  const [isGlobalForgotPasswordLoading, setIsGlobalForgotPasswordLoading] = useState(false);
  const [scrollPlanId, setScrollPlanId] = useState<string | null>(null);
  const hasAutoScrolled = useRef(false);
  const hasTriggeredReceiptFlow = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchaseId = params.get('purchase_id');
    const checkout = params.get('checkout');
    const downloadReceipt = params.get('download_receipt');
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('download_receipt') === '1') {
      setShowGlobalReceiptModal(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan_id');
    if (planId) {
      setScrollPlanId(planId);
    }
  }, []);

  useEffect(() => {
    const handleOpenReceiptModal = () => {
      setShowGlobalReceiptModal(true);
    };

    window.addEventListener('openReceiptModal', handleOpenReceiptModal as EventListener);
    return () => window.removeEventListener('openReceiptModal', handleOpenReceiptModal as EventListener);
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

  const normalizePhone = (value: string) => value.replace(/\D/g, '');

  const handleGlobalReceiptLookup = async () => {
    if (!globalReceiptLookup.phone || !globalReceiptLookup.secretPassword) {
      setGlobalReceiptError('Please enter your phone number and secret password.');
      return;
    }
    if (globalReceiptLookup.phone.length !== 10) {
      setGlobalReceiptError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
      return;
    }

    setIsGlobalReceiptLoading(true);
    setGlobalReceiptError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/purchase/receipt-lookup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: globalReceiptLookup.phone,
          secret_password: globalReceiptLookup.secretPassword,
          return_path: `${window.location.pathname}${window.location.search}`,
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.detail || 'Unable to download receipt.');
      }

      setShowGlobalReceiptModal(false);
      window.location.href = data.url;
    } catch (error: any) {
      setGlobalReceiptError(error?.message || 'Unable to download receipt.');
    } finally {
      setIsGlobalReceiptLoading(false);
    }
  };

  const handleGlobalForgotSecretPassword = async () => {
    if (!globalReceiptLookup.phone) {
      setGlobalReceiptError('Please enter your phone number first.');
      return;
    }
    if (globalReceiptLookup.phone.length !== 10) {
      setGlobalReceiptError('Phone number must be exactly 10 digits. Please check for missing or extra digits.');
      return;
    }

    setIsGlobalForgotPasswordLoading(true);
    setGlobalReceiptError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/purchase/phone-summary/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: globalReceiptLookup.phone,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Unable to find your purchase details.');
      }

      const message = (
        `Hello, I forgot my secret password for my house plan purchase. Please assist me based on my cellphone number.\n\n` +
        `Full Name: ${data.full_name}\n` +
        `Phone: ${data.phone_number}\n` +
        `Email: ${data.email}\n` +
        `Plan: ${data.plan_title}\n` +
        `Price: R ${data.plan_price}\n` +
        `Plan Link: ${data.plan_url}`
      );

      const whatsappUrl = `https://wa.me/27726659790?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;
    } catch (error: any) {
      setGlobalReceiptError(error?.message || 'Unable to find your purchase details.');
    } finally {
      setIsGlobalForgotPasswordLoading(false);
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

  // Fetch house plans from backend on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      let hasLoadedFromCache = false;

      try {
        const rawCache = localStorage.getItem(CACHE_KEY);
        if (rawCache) {
          const parsedCache = JSON.parse(rawCache);
          const isFresh = Date.now() - (parsedCache?.timestamp || 0) < CACHE_TTL_MS;
          if (isFresh && Array.isArray(parsedCache?.plans)) {
            setPlans(parsedCache.plans);
            setLoading(false);
            hasLoadedFromCache = true;
          }
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.PLANS}`);
        const data = await response.json();
        
        if (response.ok) {
          // Handle both paginated (data.results) and direct array responses
          const plansList = Array.isArray(data) ? data : data.results || [];
          
          // Transform backend data to frontend format
          const transformedPlans = plansList.map((plan: any) => {
            // Get all images
            const allImages = [
              ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
              ...(plan.primary_image ? [plan.primary_image] : [])
            ].filter(img => img);
            
            const images = allImages.length > 0 ? allImages : ['https://via.placeholder.com/600x400'];
            
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
          setPlans(transformedPlans);

          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                plans: transformedPlans,
              })
            );
          } catch {
            // Ignore cache write issues
          }
        } else {
          console.error('API Error - Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to static data
        if (!hasLoadedFromCache) {
          setPlans(housePlans);
        }
      } finally {
        if (!hasLoadedFromCache) {
          setLoading(false);
        }
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

  useEffect(() => {
    if (!scrollPlanId || hasAutoScrolled.current) return;
    const targetIndex = filteredAndSortedPlans.findIndex(
      (plan) => String(plan.id) === scrollPlanId
    );
    if (targetIndex === -1) return;
    const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;
    if (currentPage !== targetPage) {
      setCurrentPage(targetPage);
      return;
    }
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(`plan-${scrollPlanId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasAutoScrolled.current = true;
      }
    });
  }, [scrollPlanId, filteredAndSortedPlans, currentPage, itemsPerPage]);

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
      {showGlobalReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-2 border-primary/20 shadow-2xl">
            <div className="relative shrink-0 h-20 bg-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20" />
              <div className="absolute bottom-3 left-6">
                <h2 className="text-xl font-bold">Download Receipt</h2>
                <p className="text-sm text-muted-foreground">Enter your purchase details</p>
              </div>
              <button
                onClick={() => setShowGlobalReceiptModal(false)}
                className="absolute top-3 right-3 p-2 bg-background/50 hover:bg-background rounded-full transition-colors"
                aria-label="Close receipt modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  placeholder="e.g 0726659790"
                  value={globalReceiptLookup.phone}
                  onChange={(e) => setGlobalReceiptLookup({ ...globalReceiptLookup, phone: normalizePhone(e.target.value) })}
                />
                <p className="text-xs text-red-500 font-medium">Enter the phone number used for the purchase.</p>
              </div>
              <div className="space-y-2">
                <Label>Secret Password</Label>
                <div className="relative">
                  <Input
                    type={showGlobalReceiptPassword ? 'text' : 'password'}
                    placeholder="Secret Password"
                    value={globalReceiptLookup.secretPassword}
                    onChange={(e) => setGlobalReceiptLookup({ ...globalReceiptLookup, secretPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGlobalReceiptPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showGlobalReceiptPassword ? 'Hide password' : 'Show password'}
                  >
                    {showGlobalReceiptPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-red-500 font-medium">Enter the secret password used for the house plan purchase.</p>
                <button
                  type="button"
                  onClick={handleGlobalForgotSecretPassword}
                  disabled={isGlobalForgotPasswordLoading}
                  className="text-xs text-primary font-semibold hover:underline disabled:text-muted-foreground"
                >
                  {isGlobalForgotPasswordLoading ? 'Requesting help...' : 'Forgotten secret password?'}
                </button>
              </div>
              {globalReceiptError && (
                <p className="text-sm text-red-600">{globalReceiptError}</p>
              )}
              {isGlobalReceiptLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  Creating payment receipt...
                </div>
              )}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleGlobalReceiptLookup}
                  disabled={isGlobalReceiptLoading}
                  className="text-primary font-semibold hover:underline disabled:text-muted-foreground"
                >
                  {isGlobalReceiptLoading ? 'Preparing...' : 'Dowload receipt'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
            {loading && (
              <div className="text-center pb-6">
                <p className="text-muted-foreground text-base">Loading latest house plans...</p>
              </div>
            )}
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
