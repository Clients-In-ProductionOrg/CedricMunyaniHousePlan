import { Search, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type HeroSectionProps = {
  homeVideoUrl?: string;
};

const DEFAULT_VIDEO_ID = "lnpsR1M29W0";

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) {
    return `https://www.youtube.com/embed/${DEFAULT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${DEFAULT_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
  }

  if (url.includes("youtube.com/embed/")) {
    const base = url.split("?")[0];
    const videoId = base.split("/embed/")[1] || DEFAULT_VIDEO_ID;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
  }

  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
  } else if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v") || "";
  }

  const resolvedId = videoId || DEFAULT_VIDEO_ID;
  return `https://www.youtube.com/embed/${resolvedId}?autoplay=1&mute=1&loop=1&playlist=${resolvedId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
};

const HeroSection = ({ homeVideoUrl }: HeroSectionProps) => {
  const embedUrl = getYouTubeEmbedUrl(homeVideoUrl);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/10 via-blue-500/5 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
            
            {/* Left Text Section */}
            <div className="space-y-10 animate-fade-up">
              <div className="space-y-6">
                <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary rounded-full text-sm font-medium animate-fade-in shadow-sm">
                  #1 House Plan Platform in South Africa
                </Badge>
                
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Design your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Dream Future.</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Explore a premium collection of architecturally stunning house plans. 
                  Modern, efficient, and ready for construction.
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-card/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl shadow-primary/5 border border-border/50 ring-1 ring-white/20">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Search by style, bedrooms, or size..." 
                      className="pl-12 h-14 bg-transparent border-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <Button size="lg" className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl">
                    Search Plans
                  </Button>
                </div>
              </div>

              <div className="flex gap-8 items-center pt-2 border-t border-border/40">
                 <div className="flex flex-col gap-1">
                   <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full ring-2 ring-background bg-muted flex items-center justify-center overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                       </div>
                     ))}
                     <div className="w-10 h-10 rounded-full ring-2 ring-background bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold z-10 shadow-lg">
                       5k+
                     </div>
                   </div>
                   <span className="text-xs font-medium text-muted-foreground ml-1">Happy Clients</span>
                 </div>

                 <div className="h-10 w-px bg-border/60"></div>

                 <div className="space-y-1">
                   <div className="flex items-center gap-1 text-sm font-bold">
                     <span className="text-xl">4.9</span>
                     <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                     </div>
                   </div>
                   <p className="text-xs font-medium text-muted-foreground">Trusted by Homeowners</p>
                 </div>
              </div>
            </div>
            
            {/* Right Video Section */}
            <div className="relative animate-fade-in delay-200 lg:ml-4 group">
              {/* Glowing background effect */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/40 via-blue-500/20 to-purple-500/40 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              
              {/* Video Container - Sleek and borderless */}
              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] bg-black isolate transform transition-transform duration-700 hover:scale-[1.02]">
                  
                  {/* Iframe Container */}
                  <div className="absolute inset-0 bg-black">
                     <iframe 
                        src={embedUrl} 
                        className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none scale-105"
                        allow="autoplay; encrypted-media"
                        title="Hero Video"
                     />
                  </div>
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem] z-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

                  {/* Floating Elements on top of Video */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] text-white/80 font-bold tracking-wider uppercase">Live Showcase</span>
                      </div>
                      <p className="text-white font-bold text-base">Modern Luxury Villa</p>
                    </div>
                    
                    <div className="flex bg-primary text-primary-foreground p-4 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.5)] items-center justify-center w-14 h-14 shrink-0 hover:scale-110 transition-transform cursor-pointer ml-auto group-hover:bg-white group-hover:text-primary">
                      <Play className="w-6 h-6 ml-1" fill="currentColor" />
                    </div>
                  </div>
              </div>
              
            </div>
            
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
