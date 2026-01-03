import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import heroHouse from "@/assets/hero-house.jpg";

const HeroSection = () => {
  return (
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
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button size="lg" className="px-8">
                  Search
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  Modern
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  3 Bedroom
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  Double Storey
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  Luxury
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  Affordable
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-hero">
              <img 
                src={heroHouse} 
                alt="Modern luxury house" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-border flex items-center gap-2">
                <Star className="h-5 w-5 text-star fill-star" />
                <span className="font-semibold text-foreground">4.9/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
