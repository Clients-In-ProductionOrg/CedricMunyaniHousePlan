import { Bed, Bath, Square, Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HousePlanCardProps {
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
  return (
    <>
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
          {videoUrl && (
            <button 
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
              <div className="bg-orange-500 hover:bg-orange-600 p-4 rounded-full transition-colors">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </button>
          )}
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
              <span>{sqft} sq ft</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-2xl font-bold text-primary">${price}</span>
            <Button>View Plan</Button>
          </div>
        </div>
      </Card>

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
