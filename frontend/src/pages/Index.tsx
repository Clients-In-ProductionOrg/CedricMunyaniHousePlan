import { Home, Search, Heart, Bed, Bath, Square, Star, Facebook, Twitter, Instagram } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { API_ENDPOINTS, ADMIN_URL } from "@/config/constants";
import heroHouse from "@/assets/hero-house.jpg";
import houseMadison from "@/assets/house-madison.jpg";
import houseOakwood from "@/assets/house-oakwood.jpg";
import houseSummit from "@/assets/house-summit.jpg";
import houseCraftsman from "@/assets/house-craftsman.jpg";
import houseColonial from "@/assets/house-colonial.jpg";
import houseRanch from "@/assets/house-ranch.jpg";
import houseContemporary from "@/assets/house-contemporary.jpg";

// HousePlanCard Component
const HousePlanCard = ({ 
  image, 
  title, 
  beds, 
  baths, 
  sqft, 
  price,
  isBestseller = false 
}: {
  image: string;
  title: string;
  beds: number;
  baths: number;
  sqft: string;
  price: string;
  isBestseller?: boolean;
}) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="relative overflow-hidden">
        {isBestseller && (
          <Badge className="absolute top-4 right-4 z-10 bg-primary">
            Bestseller
          </Badge>
        )}
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm p-2 rounded-full hover:bg-card transition-colors">
          <Heart className="h-5 w-5 text-foreground hover:text-primary hover:fill-primary transition-colors" />
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{sqft} m²</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl font-bold text-primary">R {price}</span>
          <Link to="/house-plans">
            <Button>View Plan</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

// TestimonialCard Component
const TestimonialCard = ({ name, role, content, rating, initials }: {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}) => {
  return (
    <Card className="p-8 space-y-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-star fill-star" />
        ))}
      </div>
      
      <p className="text-foreground leading-relaxed">{content}</p>
      
      <div className="flex items-center gap-3 pt-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </Card>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("https://www.youtube.com/embed/ciXvD_-rtts?si=vgL--Q5gRYliXpUZ&autoplay=1&mute=1&loop=1&playlist=ciXvD_-rtts");
  const [loading, setLoading] = useState(true);
  const [popularPlans, setPopularPlans] = useState<any[]>([]);
  const [bestSellingPlans, setBestSellingPlans] = useState<any[]>([]);

  // Fetch site settings and house plans from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all house plans
        const plansResponse = await fetch(API_ENDPOINTS.PLANS);
        const plansData = await plansResponse.json();

        // Filter and transform popular plans
        const popular = plansData
          .filter((plan: any) => plan.is_popular)
          .map((plan: any) => {
            // Extract images the same way HousePlans.tsx does
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
            // Extract images the same way HousePlans.tsx does
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

        setPopularPlans(popular);
        setBestSellingPlans(bestSelling);
        setLoading(false);
      } catch (error) {
        console.log("Data fetch info:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      window.dispatchEvent(
        new CustomEvent("planSearch", { detail: { query: searchTerm } })
      );
      navigate("/house-plans");
    }
  };

  const handleBadgeClick = (badgeText: string) => {
    setSelectedFilter(badgeText);
    handleSearch(badgeText);
  };

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
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                    Find Your Perfect
                    <br />
                    <span className="text-primary">House Plan</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    Discover thousands of professionally designed house plans.
                    From modern minimalist to classic traditional styles.
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="Find your perfect house plan..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    <Button 
                      size="lg" 
                      className="px-8"
                      onClick={() => handleSearch()}
                    >
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleBadgeClick("Modern")}
                    >
                      Modern
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleBadgeClick("3 Bedroom")}
                    >
                      3 Bedroom
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleBadgeClick("Double Storey")}
                    >
                      Double Storey
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleBadgeClick("Luxury")}
                    >
                      Luxury
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleBadgeClick("Affordable")}
                    >
                      Affordable
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-scale-in">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-hero">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    {loading ? (
                      <div className="absolute top-0 left-0 w-full h-full rounded-3xl flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground">Loading video...</p>
                      </div>
                    ) : (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-3xl"
                        src={youtubeLink}
                        title="Cedric House Planning Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR PLANS SECTION */}
        <section id="plans" className="py-20 bg-background">
          <div className="container">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground">Popular House Plans</h2>
              <p className="text-lg text-muted-foreground">
                Trending designs chosen by thousands of homeowners
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <p className="col-span-full text-center text-muted-foreground py-12">Loading popular plans...</p>
              ) : popularPlans.length > 0 ? (
                popularPlans.map((plan, index) => (
                  <HousePlanCard key={index} {...plan} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-12">No popular plans available. Check back soon!</p>
              )}
            </div>
          </div>
        </section>

        {/* BEST SELLING PLANS SECTION */}
        <section id="styles" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground">Best-Selling Designs</h2>
              <p className="text-lg text-muted-foreground">
                Our most loved house plans by customers nationwide
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                <p className="col-span-full text-center text-muted-foreground py-12">Loading best-selling plans...</p>
              ) : bestSellingPlans.length > 0 ? (
                bestSellingPlans.map((plan, index) => (
                  <HousePlanCard key={index} {...plan} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-12">No best-selling plans available. Check back soon!</p>
              )}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground">What Our Customers Say</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of satisfied homeowners
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="contact" className="py-20 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <h2 className="text-4xl font-bold">Ready to Build Your Dream Home?</h2>
              <p className="text-lg text-primary-foreground/90">
                Get personalized building cost estimates and start your journey today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/get-quote">
                  <Button size="lg" className="text-lg px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get FREE Quote Now
                  </Button>
                </Link>
                <Link to="/house-plans">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Browse All Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-footer-darker text-muted-foreground">
        <div className="container py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-primary-foreground">Cedric House Planning</span>
              </div>
              <p className="text-sm">
                Creating beautiful, functional house plans for your dream home.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary-foreground mb-4">House Plans</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Modern Plans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Traditional Plans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Small House Plans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Luxury Plans</a></li>
              </ul>
            </div>
            
            <div id="services">
              <h3 className="font-semibold text-primary-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Custom Design</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Plan Modifications</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Construction Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cost Estimates</a></li>
              </ul>
            </div>
            
            <div id="about">
              <h3 className="font-semibold text-primary-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/20 text-center text-sm">
            <p className="mb-2">© 2024 Cedric House Planning and Construction. All rights reserved.</p>
            <p className="text-xs">Website Developers: <a href="#" className="text-red-600 hover:text-red-700 hover:underline">TAD Developers</a></p>
            <p className="text-xs mt-3"><a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">Admin Site</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
