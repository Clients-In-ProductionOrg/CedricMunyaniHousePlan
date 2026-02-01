import { Search, Star, MessageSquareText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const videoId = "lnpsR1M29W0";
  // Autoplay, Mute, Loop, No Controls, No Info, No Related (limit), Dark theme
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
            
            <div className="relative animate-fade-in delay-200">
              {/* Main Video Container */}
              <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[6px] border-white dark:border-card/20 isolate">
                  {/* Iframe with scalling to cover - removing black bars */}
                  <div className="absolute inset-[-10%] w-[120%] h-[120%] bg-black">
                     <iframe 
                        src={embedUrl} 
                        className="w-full h-full opacity-100 pointer-events-none scale-110"
                        allow="autoplay; encrypted-media"
                        title="Hero Video"
                     />
                  </div>
                  
                  {/* Gradient Overlays for integration */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem] z-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />

                  {/* Floating Elements on top of Video */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between gap-4">
                     <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex-1 transform transition-transform hover:scale-105">
                        <div className="flex items-start gap-3">
                           <div className="p-2.5 bg-green-500/10 rounded-full shrink-0">
                              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                           </div>
                           <div>
                              <p className="font-bold text-sm leading-none mb-1">Approved Design</p>
                              <p className="text-[10px] text-muted-foreground leading-snug">
                                 SANS 10400 Compliant &<br/>Municipality Ready
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="hidden sm:flex bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/20 items-center justify-center w-12 h-12 shrink-0 animate-pulse">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                     </div>
                  </div>
              </div>

               {/* Decorative background blur behind video */}
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-[2.5rem] blur-xl -z-10 opacity-70" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
