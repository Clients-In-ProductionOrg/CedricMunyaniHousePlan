import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CTASection from "@/components/CTASection";
import { 
  Home, 
  Pencil, 
  Edit3, 
  Hammer, 
  Eye, 
  Wallet, 
  Users, 
  MapPin, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Award,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import house1 from '@/assets/house1.jpg';
import house2 from '@/assets/house2.jpg';

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: Home,
      title: 'Standard House Plans',
      description: 'Ready-to-use architectural plans with complete sets including floor plans, 3D renders, and elevations.',
      badge: 'Bestseller',
      delay: 100
    },
    {
      icon: Pencil,
      title: 'Custom House Design',
      description: 'Personalized designs created from scratch based on your requirements, style preferences, and budget.',
      badge: 'Premium',
      delay: 200
    },
    {
      icon: Edit3,
      title: 'Plan Modifications',
      description: 'Professional edits to existing plans including room additions/removals, façade changes, and layout adjustments.',
      delay: 300
    },
    {
      icon: Hammer,
      title: 'Construction & Build',
      description: 'Complete structural drawings, electrical layouts, and plumbing & drainage plans for construction.',
      badge: 'Technical',
      delay: 400
    },
    {
      icon: Eye,
      title: '3D Visualization',
      description: 'Photo-realistic 3D exterior and interior renders with virtual walkthroughs and interactive tours.',
      badge: 'New',
      delay: 500
    },
    {
      icon: Wallet,
      title: 'Cost Estimation',
      description: 'Professional cost calculations with detailed material lists and budget guidance for your project.',
      delay: 600
    },
    {
      icon: Users,
      title: 'Project Consultation',
      description: 'One-on-one consultation with our experienced architects for expert advice on regulations and requirements.',
      delay: 700
    },
    {
      icon: MapPin,
      title: 'Site Analysis',
      description: 'Comprehensive evaluation of plot shape, slope, zoning rules, and recommendations for best plan options.',
      delay: 800
    },
    {
      icon: CheckCircle,
      title: 'Council Submission',
      description: 'Structural certification and professional endorsement for approved plans and designs.',
      badge: 'Essential',
      delay: 900
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Discovery & Brief',
      description: 'We begin by understanding your vision, budget, and lifestyle requirements through detailed consultation.',
    },
    {
      number: '02',
      title: 'Concept & Sketch',
      description: 'Our architects translate your ideas into preliminary sketches and spatial layout options for your review.',
    },
    {
      number: '03',
      title: 'Refinement',
      description: 'We develop the chosen concept, adding architectural details and specifications for your approval.',
    },
    {
      number: '04',
      title: '3D Visualization',
      description: 'High-definition 3D renders help you visualize the final result before any construction begins.',
    },
    {
      number: '05',
      title: 'Technical Docs',
      description: 'We prepare detailed technical drawings, including electrical, plumbing, and structural plans.',
    },
    {
      number: '06',
      title: 'Final Delivery',
      description: 'You receive a complete, submission-ready architectural package with all necessary documentation.',
    },
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: '20+ Years Experience',
      description: 'Decades of expertise in architectural design and house planning across South Africa.',
    },
    {
      icon: Award,
      title: 'Award-Winning Team',
      description: 'Our team has been recognized for design excellence and innovation in residential architecture.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'We prioritize your unique vision and lifestyle needs throughout the entire design process.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assured',
      description: 'Every design meets the highest standards of building regulations and quality compliance.',
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'We respect your timeline and utilize modern tools to deliver compliant plans on schedule.',
    },
    {
      icon: Sparkles,
      title: 'Modern Aesthetics',
      description: 'Our designs reflect contemporary trends while ensuring timeless appeal and functionality.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40 z-10" />
             <img 
               src={house1} 
               alt="Architectural Services" 
               className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
             />
          </div>
          
          <div className="container relative z-20 px-4 pt-20">
            <div className="max-w-4xl space-y-6 animate-fade-up">
              <Badge variant="outline" className="px-4 py-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md rounded-full text-sm font-medium tracking-wide">
                Professional Architectural Services
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Designing the Future <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  of Living.
                </span>
              </h1>
              <p className="text-xl text-slate-200 max-w-2xl leading-relaxed">
                Expert architectural solutions tailored to your lifestyle. From concept to construction, 
                we bring your dream home to reality with precision and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                   size="lg" 
                   className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-8 h-12 shadow-lg shadow-primary/25"
                   onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Services
                </Button>
                <Button 
                   variant="outline" 
                   size="lg" 
                   className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 backdrop-blur-sm"
                   onClick={() => navigate('/contact')}
                >
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
          
          <div className="container relative z-10 px-4">
             <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
               <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3 text-center">What We Offer</h2>
               <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">Comprehensive Architectural Solutions</h3>
               <p className="text-xl text-muted-foreground text-center">
                 Whether you need a ready-made plan, a custom design, or technical documentation, our expert team is ready to deliver excellence.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card 
                      key={index} 
                      className="group relative p-8 h-full bg-card border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                      style={{ animationDelay: `${service.delay}ms` }}
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <ArrowRight className="w-5 h-5 text-primary -translate-x-2 group-hover:translate-x-0 transition-transform" />
                      </div>
                      
                      <div className="mb-6 flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                          <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-500" />
                        </div>
                        {service.badge && (
                          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                            {service.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </Card>
                  )
                })}
             </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-muted/30 border-y border-border/40">
          <div className="container px-4">
             <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                <div>
                   <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">How It Works</h2>
                   <h3 className="text-4xl font-bold text-foreground mb-6">A Seamless Design Process</h3>
                   <p className="text-xl text-muted-foreground">
                     We've refined our workflow to ensure a smooth, transparent, and collaborative experience from the first sketch to final approval.
                   </p>
                   
                   <div className="mt-8">
                     <Button onClick={() => navigate('/contact')} className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                       Start Your Project
                     </Button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {processSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-4xl font-bold text-slate-200 dark:text-slate-800 mb-2 block">
                        {step.number}
                      </span>
                      <h4 className="font-bold text-foreground text-lg mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* Feature Highlight Section */}
        <section className="py-24 bg-background">
           <div className="container px-4">
             <div className="rounded-3xl bg-slate-900 overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="grid lg:grid-cols-2">
                 <div className="p-12 lg:p-16 flex flex-col justify-center relative z-10">
                    <Badge className="w-fit mb-6 bg-blue-500/20 text-blue-300 border-blue-400/20 hover:bg-blue-500/30">
                       Featured Service
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                      Plan Modifications & <br/>Optimization
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                      Love a plan but need a few tweaks? Our modification service allows you to customize any of our standard plans to perfectly fit your site, budget, and lifestyle.
                    </p>
                    
                    <ul className="space-y-4 mb-10">
                      {[
                        "Add or remove rooms and spaces",
                        "Adjust dimensions to fit your plot",
                        "Modernize façades and exterior looks",
                        "Optimize layouts for better flow"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/90">
                           <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                             <CheckCircle className="w-4 h-4" />
                           </div>
                           {item}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => navigate('/contact')}
                      className="w-fit bg-white text-slate-900 hover:bg-white/90 font-bold rounded-full px-8 h-12"
                    >
                      Request Modification
                    </Button>
                 </div>
                 <div className="relative min-h-[400px] lg:min-h-full">
                    <img 
                      src={house2} 
                      alt="Plan Modifications" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-muted/50">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-4xl font-bold text-foreground mb-6 text-center">Why Partner With Us?</h2>
               <p className="text-xl text-muted-foreground text-center">
                 We combine creative excellence with technical precision to deliver homes that stand the test of time.
               </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {whyChooseUs.map((reason, index) => {
                 const Icon = reason.icon;
                 return (
                   <div key={index} className="flex gap-5 p-6 rounded-2xl bg-background border border-border/50 hover:shadow-lg transition-all">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-2">{reason.title}</h4>
                        <p className="text-muted-foreground text-sm">{reason.description}</p>
                      </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
