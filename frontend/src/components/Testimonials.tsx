import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
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
  );
};

export default Testimonials;
