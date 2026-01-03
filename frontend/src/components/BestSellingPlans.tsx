import { useState, useEffect } from "react";
import HousePlanCard from "./HousePlanCard";
import { API_ENDPOINTS } from "@/config/constants";
import type { HousePlan } from "@/types/housePlan";

const BestSellingPlans = () => {
  const [plans, setPlans] = useState<HousePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellingPlans = async () => {
      try {
        console.log("Fetching best-selling from:", API_ENDPOINTS.PLANS);
        const response = await fetch(API_ENDPOINTS.PLANS);
        if (response.ok) {
          const data = await response.json();
          console.log("All plans:", data);
          // Filter for best-selling plans
          const bestSellingPlans = data.filter((plan: any) => plan.is_best_selling);
          console.log("Best-selling plans filtered:", bestSellingPlans);
          setPlans(bestSellingPlans.slice(0, 4)); // Show first 4
        }
      } catch (error) {
        console.error("Error fetching best-selling plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingPlans();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <p className="text-center text-muted-foreground">Loading best-selling plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="styles" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground">Best-Selling Designs</h2>
          <p className="text-lg text-muted-foreground">
            Our most loved house plans by customers nationwide
          </p>
        </div>
        
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => {
              // Extract images the same way HousePlans.tsx does
              const allImages = [
                ...(plan.images?.map((img: any) => img.image || img.image_url) || []),
                ...(plan.primary_image ? [plan.primary_image] : [])
              ].filter(img => img);
              
              const imageUrl = allImages.length > 0 ? allImages[0] : "https://via.placeholder.com/400x300?text=No+Image";
              
              console.log(`Best-Selling Plan: ${plan.title}`);
              console.log(`  Total images found: ${allImages.length}`);
              console.log(`  Using image URL: '${imageUrl}'`);
              
              return (
                <HousePlanCard
                  key={plan.id}
                  image={imageUrl}
                  title={plan.title}
                  beds={plan.bedrooms}
                  baths={plan.bathrooms}
                  sqft={plan.square_feet?.toString() || ""}
                  price={plan.price?.toString() || ""}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No best-selling plans available. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingPlans;
