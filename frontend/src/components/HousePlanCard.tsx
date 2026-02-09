import { Bed, Bath, Square, Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HousePlanCardProps {
  id: string | number;
  image: string;
  title: string;
  beds: number;
  baths: number;
  sqft: string;
  price: string;
  isBestseller?: boolean;
  videoUrl?: string;
}


const HousePlanCard = ({ 
  id,
  image, 
  title, 
  beds, 
  baths, 
  sqft, 
  price,
  isBestseller = false,
  videoUrl
}: HousePlanCardProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-shadow duration-500">
        <div className="relative aspect-[4/3] overflow-hidden">
          {isBestseller && (
            <Badge className="absolute top-4 right-4 z-10 bg-primary/90 backdrop-blur-md text-white border-0 shadow-lg font-medium px-3 py-1">
              Bestseller
            </Badge>
          )}
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <button className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2.5 rounded-full hover:bg-white/40 transition-all border border-white/20 text-white">
            <Heart className="h-5 w-5 hover:fill-red-500 hover:text-red-500 transition-colors" />
          </button>
          
          {videoUrl && (
            <button 
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </button>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
             <p className="text-sm text-muted-foreground font-medium">Modern Family Home</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/40">
            <div className="flex flex-col items-center justify-center gap-1 text-center p-2 rounded-lg bg-secondary/30">
              <Bed className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{beds} Beds</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-center p-2 rounded-lg bg-secondary/30">
              <Bath className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{baths} Baths</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-center p-2 rounded-lg bg-secondary/30">
              <Square className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{sqft} sq ft</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Starting at</p>
              <span className="text-2xl font-bold text-foreground">
                R{typeof price === 'string' && !isNaN(Number(price)) ? Number(price).toLocaleString() : price}
              </span>
            </div>
            <Button
              className="rounded-xl px-6 font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
              onClick={() => navigate(`/house-plans?plan_id=${id}`)}
            >
              View Plan
            </Button>
          </div>
        </div>
      </div>

      {showVideo && videoUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div 
            className="bg-black rounded-lg overflow-hidden max-w-4xl w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={videoUrl + "?autoplay=1"}
              title={title}
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
    </>
  );
};

export default HousePlanCard;
