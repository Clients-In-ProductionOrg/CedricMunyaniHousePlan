import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section id="contact" className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl font-bold">Ready to Build Your Dream Home?</h2>
          <p className="text-lg text-primary-foreground/90">
            Get personalized building cost estimates and start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Cost Estimate
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Browse All Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
