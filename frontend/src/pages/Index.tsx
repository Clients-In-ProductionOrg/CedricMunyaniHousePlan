import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HousePlanCard from "@/components/HousePlanCard";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/constants";
import { housePlans } from "@/data/housePlans";

const Index = () => {
  const CACHE_KEY = "index-home-data-v1";
  const CACHE_TTL_MS = 5 * 60 * 1000;
  const navigate = useNavigate();

  const mapStaticPlanToCard = (plan: any, isBestseller = false) => ({
    image: plan.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image",
    title: plan.title,
    beds: Number(plan.bedrooms || 0),
    baths: Number(plan.bathrooms || 0),
    sqft: String(Number(plan.floorArea || plan.square_feet || 0)),
    price: String(Number(plan.price || 0)),
    id: plan.id,
    isBestseller,
  });

  const fallbackPopularPlans = housePlans
    .filter((plan: any) => plan.isPopular)
    .slice(0, 6)
    .map((plan: any) => mapStaticPlanToCard(plan));

  const fallbackBestSellingPlans = housePlans
    .slice(0, 8)
    .map((plan: any) => mapStaticPlanToCard(plan, true));

  const [loading, setLoading] = useState(true);
  const [popularPlans, setPopularPlans] = useState<any[]>(fallbackPopularPlans);
  const [bestSellingPlans, setBestSellingPlans] = useState<any[]>(fallbackBestSellingPlans);
  const [homeVideoUrl, setHomeVideoUrl] = useState<string>("");

  // Fetch site settings and house plans from backend
  useEffect(() => {
    const toFiniteNumber = (value: unknown, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const toFloorAreaText = (plan: any) => {
      const floorArea = toFiniteNumber(plan.square_feet ?? plan.floor_area ?? plan.floorArea, 0);
      return floorArea.toString();
    };

    const fetchData = async () => {
      let hasLoadedFromCache = false;

      try {
        const rawCache = localStorage.getItem(CACHE_KEY);
        if (rawCache) {
          const parsedCache = JSON.parse(rawCache);
          const isFresh = Date.now() - (parsedCache?.timestamp || 0) < CACHE_TTL_MS;
          if (isFresh && Array.isArray(parsedCache?.popularPlans) && Array.isArray(parsedCache?.bestSellingPlans)) {
            setPopularPlans(parsedCache.popularPlans);
            setBestSellingPlans(parsedCache.bestSellingPlans);
            setHomeVideoUrl(parsedCache.homeVideoUrl || "");
            setLoading(false);
            hasLoadedFromCache = true;
          }
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }

      try {
        const [plansResult, settingsResult] = await Promise.allSettled([
          fetch(API_ENDPOINTS.PLANS),
          fetch(API_ENDPOINTS.SITE_SETTINGS),
        ]);

        let resolvedHomeVideoUrl = "";

        if (settingsResult.status === 'fulfilled') {
          const settingsResponse = settingsResult.value;
          const settingsData = settingsResponse.ok ? await settingsResponse.json() : null;
          resolvedHomeVideoUrl = settingsData?.home_video_url || "";
          setHomeVideoUrl(resolvedHomeVideoUrl);
        } else {
          setHomeVideoUrl("");
        }

        if (plansResult.status !== 'fulfilled') {
          throw plansResult.reason;
        }

        const plansResponse = plansResult.value;
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch house plans');
        }
        const plansData = await plansResponse.json();

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
              beds: toFiniteNumber(plan.bedrooms),
              baths: Math.round(toFiniteNumber(plan.bathrooms)),
              sqft: toFloorAreaText(plan),
              price: Math.round(toFiniteNumber(plan.price)).toLocaleString(),
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
              beds: toFiniteNumber(plan.bedrooms),
              baths: Math.round(toFiniteNumber(plan.bathrooms)),
              sqft: toFloorAreaText(plan),
              price: Math.round(toFiniteNumber(plan.price)).toLocaleString(),
              id: plan.id,
              isBestseller: true
            };
          });

        setPopularPlans(popular.length > 0 ? popular.slice(0, 6) : fallbackPopularPlans);
        setBestSellingPlans(bestSelling.length > 0 ? bestSelling.slice(0, 8) : fallbackBestSellingPlans);

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              popularPlans: popular.length > 0 ? popular.slice(0, 6) : fallbackPopularPlans,
              bestSellingPlans: bestSelling.length > 0 ? bestSelling.slice(0, 8) : fallbackBestSellingPlans,
              homeVideoUrl: resolvedHomeVideoUrl,
            })
          );
        } catch {
          // Ignore caching failures (private mode/storage limits)
        }

        setLoading(false);
      } catch (error) {
        console.log("Data fetch info:", error);
        if (!hasLoadedFromCache) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

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
              {loading && (
                <div className="col-span-full text-center pb-4">
                  <div className="animate-pulse text-muted-foreground">Loading latest plans...</div>
                </div>
              )}
              {popularPlans.length > 0 ? (
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
              {loading && (
                <div className="col-span-full text-center pb-4">
                  <div className="animate-pulse text-muted-foreground">Loading latest best-selling plans...</div>
                </div>
              )}
              {bestSellingPlans.length > 0 ? (
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

        {/* CTA SECTION */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
