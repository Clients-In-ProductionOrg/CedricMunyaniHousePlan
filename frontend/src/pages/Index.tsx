import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HousePlanCard from "@/components/HousePlanCard";
import TestimonialCard from "@/components/TestimonialCard";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/constants";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popularPlans, setPopularPlans] = useState<any[]>([]);
  const [bestSellingPlans, setBestSellingPlans] = useState<any[]>([]);
  const [homeVideoUrl, setHomeVideoUrl] = useState<string>("");

  // Fetch site settings and house plans from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all house plans
        const plansResponse = await fetch(API_ENDPOINTS.PLANS);
        const plansData = await plansResponse.json();

        // Fetch site settings for homepage video URL
        const settingsResponse = await fetch(API_ENDPOINTS.SITE_SETTINGS);
        const settingsData = settingsResponse.ok ? await settingsResponse.json() : null;
        setHomeVideoUrl(settingsData?.home_video_url || "");

        // Filter and transform popular plans
        const popular = plansData
          .filter((plan: any) => plan.is_popular)
          .map((plan: any) => {
            const allImages = [
              ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
              ...(plan.primary_image ? [plan.primary_image] : [])
            ].filter(img => img);
            
            const image = allImages.length > 0 ? allImages[0] : "https://via.placeholder.com/400x300?text=No+Image";
            
            return {
              image: image,
              title: plan.title,
              beds: plan.bedrooms,
              baths: Math.round(plan.bathrooms),
              sqft: plan.square_feet.toString(),
              price: Math.round(plan.price).toLocaleString(),
              id: plan.id
            };
          });

        // Filter and transform best-selling plans
        const bestSelling = plansData
          .filter((plan: any) => plan.is_best_selling)
          .map((plan: any) => {
            const allImages = [
              ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
              ...(plan.primary_image ? [plan.primary_image] : [])
            ].filter(img => img);
            
            const image = allImages.length > 0 ? allImages[0] : "https://via.placeholder.com/400x300?text=No+Image";
            
            return {
              image: image,
              title: plan.title,
              beds: plan.bedrooms,
              baths: Math.round(plan.bathrooms),
              sqft: plan.square_feet.toString(),
              price: Math.round(plan.price).toLocaleString(),
              id: plan.id,
              isBestseller: true
            };
          });

        setPopularPlans(popular.slice(0, 6));
        setBestSellingPlans(bestSelling.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.log("Data fetch info:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Testimonials Data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Customer",
      content: "The process was seamless and the plans were exactly what we needed. Our builder was impressed with the quality and detail.",
      rating: 5,
      initials: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Verified Customer",
      content: "Outstanding customer service and beautiful designs. We found our dream home plan and couldn't be happier with the result.",
      rating: 5,
      initials: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Verified Customer",
      content: "Professional, detailed plans that saved us time and money. The customization options were perfect for our needs.",
      rating: 5,
      initials: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />

      <main>
        {/* HERO SECTION */}
        <HeroSection homeVideoUrl={homeVideoUrl} />

        {/* POPULAR PLANS SECTION */}
        <section id="plans" className="py-24 bg-background relative">
          <div className="container">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Popular House Plans</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trending designs chosen by thousands of homeowners for their extensive functionality and style.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full h-64 flex items-center justify-center">
                   <div className="animate-pulse text-muted-foreground">Loading premium plans...</div>
                </div>
              ) : popularPlans.length > 0 ? (
                popularPlans.map((plan, index) => (
                  <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <HousePlanCard {...plan} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-12">No popular plans available. Check back soon!</p>
              )}
            </div>
          </div>
        </section>

        {/* BEST SELLING PLANS SECTION */}
        <section id="styles" className="py-24 bg-secondary/30 relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
           <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="container relative z-10">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Best-Selling Designs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our most loved house plans by customers nationwide, featuring the best in modern living.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full h-64 flex items-center justify-center">
                   <div className="animate-pulse text-muted-foreground">Loading best-selling plans...</div>
                </div>
              ) : bestSellingPlans.length > 0 ? (
                bestSellingPlans.map((plan, index) => (
                  <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <HousePlanCard {...plan} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-12">No best-selling plans available. Check back soon!</p>
              )}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-background">
          <div className="container">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">What Our Customers Say</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied homeowners who trusted us with their dream.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
