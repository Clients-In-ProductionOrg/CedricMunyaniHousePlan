import { Star } from "lucide-react";
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

export default TestimonialCard;
