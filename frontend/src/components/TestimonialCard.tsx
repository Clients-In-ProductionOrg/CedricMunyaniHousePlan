import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

const TestimonialCard = ({ name, role, content, rating, initials }: TestimonialCardProps) => {
  return (
    <Card className="relative p-8 space-y-6 hover:shadow-xl transition-all duration-300 animate-fade-in border-border/50 bg-card/50 backdrop-blur-sm group hover:-translate-y-1">
      <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
        <Quote className="h-12 w-12 fill-current" />
      </div>

      <div className="flex gap-1 relative z-10">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-star fill-star" />
        ))}
      </div>
      
      <p className="text-foreground/80 leading-relaxed font-medium relative z-10">"{content}"</p>
      
      <div className="flex items-center gap-4 pt-2 border-t border-border/40 relative z-10">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-foreground text-sm">{name}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{role}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
