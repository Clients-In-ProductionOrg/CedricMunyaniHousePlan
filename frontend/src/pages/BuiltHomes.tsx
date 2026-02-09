import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, List, CircleHelp, Heart, Home, Bed, Bath, Car, Search, X, ChevronDown, ChevronUp, SlidersHorizontal, Eye, EyeOff, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { builtHomes } from '@/data/builtHomes';
import { FilterState, SortOption, HousePlan } from '@/types/housePlan';
import { cn } from '@/lib/utils';
import { ImageGallery } from '@/components/ImageGallery';
import { FilterSidebar } from '@/components/FilterSidebar';
import Header from '@/components/Header';

// BuiltHomeCard Component
function BuiltHomeCard({ plan }: { plan: HousePlan }) {
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
  const [paymentInfo, setPaymentInfo] = useState({ 
    cardNumber: '', 
    expiryDate: '', 
    cvv: '' 
  });
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const normalizePhone = (value: string) => value.replace(/\D/g, '');

  const handlePurchaseErrorOk = () => {
    setShowPurchaseErrorModal(false);
    setShowBuyModal(true);
    requestAnimationFrame(() => {
      secretPasswordInputRef.current?.focus();
    });
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

  // Handle Checkout API payment
  const handleCheckoutPayment = async (home: any, purchaseIdValue: string) => {
    setIsProcessingPayment(true);
    try {
      const origin = window.location.origin;
      const successReturnUrl = `${origin}/built-homes?checkout=success&purchase_id=${purchaseIdValue}`;
      const cancelReturnUrl = `${origin}/built-homes?checkout=cancel&purchase_id=${purchaseIdValue}`;
      const failureReturnUrl = `${origin}/built-homes?checkout=failure&purchase_id=${purchaseIdValue}`;

      const backendUrl = 'https://cedricmunyanihouseplan-backend.onrender.com';
      const successUrl = `${backendUrl}/api/purchase/${purchaseIdValue}/success/?return_url=${encodeURIComponent(successReturnUrl)}`;
      const cancelUrl = `${backendUrl}/api/purchase/${purchaseIdValue}/cancel/?return_url=${encodeURIComponent(cancelReturnUrl)}`;
      const failureUrl = `${backendUrl}/api/purchase/${purchaseIdValue}/failure/?return_url=${encodeURIComponent(failureReturnUrl)}`;

      const response = await fetch(`https://cedricmunyanihouseplan-backend.onrender.com/api/create-checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchase_id: purchaseIdValue,
          success_url: successUrl,
          cancel_url: cancelUrl,
          failure_url: failureUrl,
        })
      });

      const data = await response.json();
      if (data.success && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
        <div 
          className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
          onClick={() => setIsGalleryOpen(true)}
        >
          <img
            src={plan.images[currentImageIndex]}
            alt={plan.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white font-medium drop-shadow-md">View {plan.images.length} Photos</span>
             </div>
          </div>
          
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Badge className="bg-green-600/90 backdrop-blur-md text-white border-none shadow-lg">Completed</Badge>
            {plan.isPopular && (
              <Badge className="bg-amber-500/90 backdrop-blur-md text-white border-none shadow-lg">Featured</Badge>
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
                     Built Home
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
                <Home className="w-4 h-4 text-primary" />
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
                {plan.levels} Level{plan.levels > 1 ? 's' : ''}
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {plan.width}m × {plan.depth}m
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
        </div>
      </div>

      {showVideo && plan.videoUrl && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={plan.videoUrl + "?autoplay=1&mute=1&loop=1&playlist=" + plan.videoUrl.split('/').pop()}
              title={plan.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Download Receipt</h2>
                  <p className="text-sm text-muted-foreground">Enter your purchase details</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close receipt modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="e.g 0726659790"
                  value={receiptLookup.phone}
                  onChange={(e) => setReceiptLookup({ ...receiptLookup, phone: normalizePhone(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <p className="text-xs text-red-500 font-medium">Enter the phone number used for the purchase.</p>
                <div className="relative">
                  <input
                    type={showReceiptPassword ? 'text' : 'password'}
                    placeholder="Secret Password"
                    value={receiptLookup.secretPassword}
                    onChange={(e) => setReceiptLookup({ ...receiptLookup, secretPassword: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm pr-10"
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
              </div>
            </div>
          </Card>
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
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, name: e.target.value });
                      if (missingFields.name) {
                        setMissingFields({ ...missingFields, name: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.name ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactInfo.email}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, email: e.target.value });
                      if (missingFields.email) {
                        setMissingFields({ ...missingFields, email: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.email ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="tel"
                    placeholder="e.g 0726659790"
                    value={contactInfo.phone}
                    onChange={(e) => {
                      const normalizedPhone = normalizePhone(e.target.value);
                      setContactInfo({ ...contactInfo, phone: normalizedPhone });
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
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.phone || phoneValidationError ? 'border-red-500' : ''}`}
                  />
                  {phoneValidationError && (
                    <p className="text-sm text-red-600 mb-2">{phoneValidationError}</p>
                  )}
                  <p className="text-xs text-red-500 font-medium mb-1">This secret password is required to download your payment receipt. Please keep it safe.</p>
                  <div className="relative">
                    <input
                      type={showSecretPassword ? 'text' : 'password'}
                      placeholder="Secret Password"
                      value={contactInfo.secretPassword}
                      onChange={(e) => {
                        const nextValue = e.target.value;
                        const nextConfirm = contactInfo.confirmPassword;
                        setContactInfo({ ...contactInfo, secretPassword: nextValue });
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
                      className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm pr-10 ${missingFields.secretPassword ? 'border-red-500' : ''}`}
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
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={contactInfo.confirmPassword}
                      onChange={(e) => {
                        const nextValue = e.target.value;
                        const nextSecret = contactInfo.secretPassword;
                        setContactInfo({ ...contactInfo, confirmPassword: nextValue });
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
                      className={`w-full px-3 py-2 border rounded-lg mb-1 text-sm pr-10 ${missingFields.confirmPassword ? 'border-red-500' : ''}`}
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
                    <p className="text-xs text-red-600 mb-2">Passwords do not match.</p>
                  )}
                  <input
                    type="text"
                    placeholder="Province"
                    value={contactInfo.province}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, province: e.target.value });
                      if (missingFields.province) {
                        setMissingFields({ ...missingFields, province: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.province ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={contactInfo.city}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, city: e.target.value });
                      if (missingFields.city) {
                        setMissingFields({ ...missingFields, city: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.city ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="text"
                    placeholder="Pick-up Point"
                    value={contactInfo.pickupPoint}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, pickupPoint: e.target.value });
                      if (missingFields.pickupPoint) {
                        setMissingFields({ ...missingFields, pickupPoint: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg mb-3 text-sm ${missingFields.pickupPoint ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="text"
                    placeholder="Area / Mall"
                    value={contactInfo.areaMall}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, areaMall: e.target.value });
                      if (missingFields.areaMall) {
                        setMissingFields({ ...missingFields, areaMall: false });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${missingFields.areaMall ? 'border-red-500' : ''}`}
                  />
                  {Object.values(missingFields).some(Boolean) && (
                    <p className="text-xs text-red-600 mt-2">Please fill in all required fields.</p>
                  )}
                  {purchaseError && (
                    <p className="text-xs text-red-600 mt-2">{purchaseError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={async () => {
                    // Save purchase to database
                    try {
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
                      const response = await fetch(API_ENDPOINTS.PURCHASES, {
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
                      
                      const data = await response.json();
                      if (data.success) {
                        const purchaseIdentifier = data.public_id || data.id;
                        setPurchaseId(purchaseIdentifier);
                        console.log('Purchase saved:', purchaseIdentifier);
                        setShowBuyModal(false);
                        // Trigger Yoco payment directly with v2 API
                        await handleCheckoutPayment(plan, purchaseIdentifier);
                      } else {
                        const errorMessage = data.error || data.detail || 'Error saving purchase. Please try again.';
                        setPurchaseError(errorMessage);
                        setPurchaseErrorModalMessage(errorMessage);
                        setShowPurchaseErrorModal(true);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      setPurchaseError('Error saving purchase. Please try again.');
                      setPurchaseErrorModalMessage('Error saving purchase. Please try again.');
                      setShowPurchaseErrorModal(true);
                    }
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

      {/* Payment Processing Modal (no longer needed - using Yoco popup instead) */}
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

                {/* Price Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">R{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">Yoco payment popup will appear shortly...</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isProcessingPayment}
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
    </>
  );
}

// Main BuiltHomes Page Component
export const BuiltHomes = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [apiPlans, setApiPlans] = useState<HousePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptPurchaseId, setReceiptPurchaseId] = useState<string | null>(null);
  const [showReceiptBanner, setShowReceiptBanner] = useState(false);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const hasTriggeredReceiptFlow = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

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

  // Fetch built homes from API
  useEffect(() => {
    const fetchBuiltHomes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.BUILT_HOMES);
        const data = await response.json();
        
        console.log('Built homes API response:', data);
        
        // Handle both paginated and non-paginated responses
        const plansList = Array.isArray(data) ? data : data.results || [];
        
        // Transform API response to match HousePlan type
        const transformedPlans = plansList.map((plan: any) => {
          // Get all images
          const allImages = [
            ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
            ...(plan.primary_image ? [plan.primary_image] : [])
          ].filter(img => img);
          
          const images = allImages.length > 0 ? allImages : ['https://via.placeholder.com/600x400'];
          
          return {
            id: plan.id,
            title: plan.title,
            price: parseFloat(plan.price),
            bedrooms: plan.bedrooms,
            bathrooms: plan.bathrooms,
            garage: plan.garage,
            floorArea: plan.square_feet,
            levels: plan.floors?.length || 1,
            width: plan.width_meters || 0,
            depth: plan.depth_meters || 0,
            style: [plan.style] || ['Modern'],
            isNew: plan.is_new,
            isPopular: plan.is_popular,
            images: images,
            description: plan.description,
            features: plan.features?.map((f: any) => f.name) || [],
            videoUrl: plan.video_url || '',
            enSuite: 1,
            lounges: plan.floors?.reduce((sum: number, f: any) => sum + (f.lounges || 0), 0) || 0,
            diningAreas: plan.floors?.reduce((sum: number, f: any) => sum + (f.dining_areas || 0), 0) || 0,
            garageParking: plan.garage,
            coveredParking: 0,
            petFriendly: plan.is_pet_friendly,
            amenities: plan.amenities?.map((a: any) => a.name) || [],
            floors: plan.floors || [],
            propertyType: plan.property_type,
            landSize: plan.land_size,
            status: plan.status
          };
        });
        
        console.log('Transformed built homes:', transformedPlans);
        setApiPlans(transformedPlans);
      } catch (error) {
        console.error('Error fetching built homes:', error);
        // Fallback to static data
        setApiPlans(builtHomes);
      } finally {
        setLoading(false);
      }
    };

    fetchBuiltHomes();
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

  // Filter and sort built homes
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = [...apiPlans];

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
  }, [filters, sortBy, searchQuery, apiPlans]);

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
                    Built Homes Showcase
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
              </div>
              
              <p className="text-sm md:text-base text-muted-foreground px-4 md:px-8 pb-4">
                Showing {filteredAndSortedPlans.length} results
              </p>
            </div>

            {/* Built Homes Grid */}
            <div className="p-4 md:p-6 lg:p-8">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Loading built homes...</p>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                        : 'space-y-4'
                    }
                  >
                    {paginatedPlans.length > 0 ? (
                      paginatedPlans.map((plan) => (
                        <BuiltHomeCard key={plan.id} plan={plan} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground text-lg">No homes found matching your criteria.</p>
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
                </>
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

export default BuiltHomes;
