import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-primary z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-primary opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-200">Dream Home?</span>
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Get personalized building cost estimates, premium architectural support, and start your construction journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/get-quote">
              <Button size="lg" className="h-14 px-8 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-2xl hover:shadow-orange-500/20 transition-all hover:-translate-y-1 rounded-full">
                Get FREE Quote Now
              </Button>
            </Link>
            <Link to="/house-plans">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white hover:text-primary transition-all rounded-full">
                Browse All Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
