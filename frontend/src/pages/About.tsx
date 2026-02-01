import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from "@/components/CTASection";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Users, 
  Heart, 
  Lightbulb, 
  CheckCircle, 
  Building2, 
  Target,
  Rocket, 
  ThumbsUp,
  Globe,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import house1 from '@/assets/house1.jpg';
import house2 from '@/assets/house2.jpg';
import house3 from '@/assets/house3.jpg';
import house4 from '@/assets/house4.jpg';

const About = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Years Experience", value: "20+", icon: Award },
        { label: "Projects Completed", value: "500+", icon: Building2 },
        { label: "Happy Clients", value: "98%", icon: ThumbsUp },
        { label: "Cities Covered", value: "15+", icon: Globe },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Client-Centric',
            description: 'We listen deeply and design around your life, ensuring every corner reflects your unique story.',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            icon: Lightbulb,
            title: 'Innovative Design',
            description: 'Pushing boundaries with modern aesthetics, smart home integration, and sustainable practices.',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            icon: Target,
            title: 'Precision & Quality',
            description: 'Meticulous attention to detail in every blueprint, ensuring perfection from concept to construction.',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: Users,
            title: 'Collaborative Spirit',
            description: 'Building strong partnerships with engineers, contractors, and you for seamless execution.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
    ];

    const team = [
        {
            name: 'John Cedric',
            role: 'Principal Architect',
            bio: 'With over 25 years of experience, John leads the vision of creating homes that inspire and endure.',
            // Black Male
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Sarah Mitchell',
            role: 'Design Director',
            bio: 'An award-winning designer passionate about sustainable and biophilic residential architecture.',
            // White Female
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Michael Ross',
            role: 'Head of Engineering',
            bio: 'Expert in structural integrity and modern construction methodologies.',
            // White Male
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Emma Rodriguez',
            role: 'Interior Specialist',
            bio: 'Transforming spaces into comfortable, functional, and aesthetically stunning environments.',
            // Black Female
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
        },
    ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 z-10" />
                <img 
                  src={house3} 
                  alt="About Cedric House Designs" 
                  className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
                />
             </div>
             
             <div className="container relative z-20 px-4 pt-20">
               <div className="max-w-4xl space-y-8 animate-fade-up">
                 <Badge variant="outline" className="px-4 py-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md rounded-full text-sm font-medium tracking-wide">
                   About Our Firm
                 </Badge>
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                   Crafting Legacies, <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                     One Home at a Time.
                   </span>
                 </h1>
                 <p className="text-xl md:text-2xl text-slate-200 max-w-2xl leading-relaxed font-light">
                   We are a team of visionary architects and designers dedicated to redefining residential living 
                   through innovation, elegance, and unwavering quality.
                 </p>
               </div>
             </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b bg-card relative z-30 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="flex flex-col items-center text-center space-y-2">
                             <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                                <Icon className="w-6 h-6" />
                             </div>
                             <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                             <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        </div>
                    )
                })}
             </div>
        </section>

        {/* Introduction / Our Story */}
        <section className="py-24 bg-background">
            <div className="container px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-sm font-bold text-primary tracking-widest uppercase">Our Story</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            More Than Just <br/> Blueprints.
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Founded over 20 years ago, Cedric House Designs began with a simple belief: 
                            <span className="text-foreground font-semibold"> a home should be the perfect backdrop for life's best moments.</span>
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            From humble beginnings, we have grown into one of the region's most respected architectural firms. 
                            Our journey is defined by a relentless pursuit of design excellence and a deep commitment to our clients. 
                            We don't just designing structures; we engineer lifestyles, curate comfort, and build the future.
                        </p>
                        <div className="pt-4">
                             <Button onClick={() => navigate('/contact')} size="lg" className="rounded-full px-8">
                                Work With Us
                             </Button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl opacity-70" />
                        <div className="relative grid grid-cols-2 gap-4">
                            <img src={house1} alt="Classic Design" className="rounded-2xl shadow-lg object-cover h-64 w-full translate-y-8" />
                            <img src={house2} alt="Modern Architecture" className="rounded-2xl shadow-lg object-cover h-64 w-full -translate-y-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
             <div className="container relative z-10 px-4">
                 <div className="text-center max-w-3xl mx-auto mb-16">
                     <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                     <h2 className="text-4xl font-bold mb-6">Our Mission & Vision</h2>
                     <p className="text-xl text-slate-300">
                         To continuously raise the standard of residential architecture, making world-class design accessible, sustainable, and deeply personal.
                     </p>
                 </div>

                 <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                     <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                         <h3 className="text-2xl font-bold text-blue-300 mb-4">Innovation First</h3>
                         <p className="text-slate-400">Leveraging the latest in 3D visualization, VR, and sustainable materials to create homes for the future.</p>
                     </div>
                     <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                         <h3 className="text-2xl font-bold text-purple-300 mb-4">Sustainable Living</h3>
                         <p className="text-slate-400">Designing energy-efficient homes that respect the environment while reducing long-term costs for owners.</p>
                     </div>
                     <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                         <h3 className="text-2xl font-bold text-emerald-300 mb-4">Enduring Quality</h3>
                         <p className="text-slate-400">Partnerships with top-tier engineers and builders to ensure every structure stands the test of time.</p>
                     </div>
                 </div>
             </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-muted/30">
             <div className="container px-4">
                 <div className="text-center max-w-3xl mx-auto mb-16">
                     <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
                     <p className="text-lg text-muted-foreground">The principles that guide every line we draw and every decision we make.</p>
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {values.map((val, i) => {
                         const Icon = val.icon;
                         return (
                             <Card key={i} className="p-8 border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                                 <div className={`w-14 h-14 rounded-2xl ${val.bg} ${val.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                     <Icon className="w-7 h-7" />
                                 </div>
                                 <h3 className="text-xl font-bold text-foreground mb-3">{val.title}</h3>
                                 <p className="text-muted-foreground leading-relaxed text-sm">
                                     {val.description}
                                 </p>
                             </Card>
                         )
                     })}
                 </div>
             </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-background">
             <div className="container px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                         <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Leadership</h2>
                         <h3 className="text-4xl font-bold text-foreground">Meet The Minds</h3>
                    </div>
                    <Button variant="outline" className="hidden md:flex">View All Team Members</Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {team.map((member, index) => (
                         <div key={index} className="group relative">
                             <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-4 relative group-hover:shadow-lg transition-all duration-300">
                                  <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  
                                  {/* Social Overlay */}
                                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                       <span className="text-white font-medium cursor-pointer hover:underline">LinkedIn</span>
                                       <span className="text-white font-medium cursor-pointer hover:underline">Twitter</span>
                                  </div>
                             </div>
                             <h4 className="text-xl font-bold text-foreground">{member.name}</h4>
                             <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                             <p className="text-muted-foreground text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                 {member.bio}
                             </p>
                         </div>
                     ))}
                </div>
             </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default About;
