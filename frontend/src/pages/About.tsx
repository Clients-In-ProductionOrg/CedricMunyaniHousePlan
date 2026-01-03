import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Heart, Lightbulb, CheckCircle, Building2, Home, Facebook, Twitter, Instagram } from 'lucide-react';
import house1 from '@/assets/house1.jpg';
import house2 from '@/assets/house2.jpg';
import house3 from '@/assets/house3.jpg';
import house4 from '@/assets/house4.jpg';

const About = () => {
  const team = [
    {
      name: 'John Cedric',
      role: 'Founder & Lead Architect',
      experience: '25+ years',
      specialty: 'Modern & Contemporary Design',
      image: '👨‍💼',
    },
    {
      name: 'Sarah Mitchell',
      role: 'Design Director',
      experience: '18+ years',
      specialty: 'Residential Architecture',
      image: '👩‍💼',
    },
    {
      name: 'Michael Chen',
      role: 'Project Manager',
      experience: '15+ years',
      specialty: 'Project Coordination',
      image: '👨‍💻',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Interior Designer',
      experience: '12+ years',
      specialty: 'Space Planning',
      image: '👩‍🎨',
    },
  ];

  const certifications = [
    { name: 'AIA Certified', icon: Award },
    { name: 'LEED Accredited', icon: Award },
    { name: 'Architecture Board Certified', icon: CheckCircle },
    { name: 'ISO 9001:2015 Certified', icon: Award },
  ];

  const portfolioItems = [
    { image: house1, title: 'Modern Riverside Estate', year: '2024' },
    { image: house2, title: 'Traditional Farmhouse', year: '2023' },
    { image: house3, title: 'Mediterranean Villa', year: '2023' },
    { image: house4, title: 'Contemporary Urban Home', year: '2024' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Client-Focused',
      description: 'We listen to our clients and bring their vision to life with precision and care.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We stay at the forefront of architectural trends and sustainable design practices.',
    },
    {
      icon: Building2,
      title: 'Quality',
      description: 'We commit to the highest standards in design, materials, and craftsmanship.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work closely with contractors, engineers, and clients to ensure success.',
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">About Cedric House Designs</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Crafting exceptional homes and dreams for over two decades.
            </p>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-foreground">Who We Are</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cedric House Designs is a leading architectural firm specializing in residential home design and planning. 
                  With over two decades of experience, we've built a reputation for creating beautiful, functional, and 
                  sustainable homes that exceed our clients' expectations.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our team of certified architects, designers, and project managers work collaboratively to transform 
                  your vision into reality. We pride ourselves on understanding our clients' needs and delivering 
                  exceptional designs that stand the test of time.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src={house1} alt="Our Work" className="rounded-lg shadow-lg" />
                <img src={house2} alt="Our Work" className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-8 text-center">Our Mission</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="p-8 border-l-4 border-l-primary">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To design and deliver exceptional residential homes that combine aesthetic beauty, functional excellence, 
                  and sustainable practices. We are committed to understanding our clients' unique vision and transforming it 
                  into a home that brings joy, comfort, and lasting value.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Architectural Background Section */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-8">Architectural Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Modern Design Expertise</h3>
                      <p className="text-muted-foreground">Specializing in contemporary and modern residential architecture</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Sustainable Design</h3>
                      <p className="text-muted-foreground">LEED accredited and committed to eco-friendly practices</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Classic to Contemporary</h3>
                      <p className="text-muted-foreground">Experience across all architectural styles and periods</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Smart Home Integration</h3>
                      <p className="text-muted-foreground">Cutting-edge technology seamlessly integrated into designs</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src={house3} alt="Design Work" className="rounded-lg shadow-lg" />
                <img src={house4} alt="Design Work" className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Why Clients Trust Us Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Why Clients Trust Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">20+ Years</h3>
                <p className="text-muted-foreground">
                  Over two decades of proven experience in residential architecture and design excellence.
                </p>
              </Card>
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">500+ Projects</h3>
                <p className="text-muted-foreground">
                  Successfully completed over 500 residential projects with 98% client satisfaction rate.
                </p>
              </Card>
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">Award Winning</h3>
                <p className="text-muted-foreground">
                  Multiple awards for design excellence, innovation, and sustainable architecture.
                </p>
              </Card>
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">Transparent Process</h3>
                <p className="text-muted-foreground">
                  Clear communication, detailed timelines, and regular updates throughout every project.
                </p>
              </Card>
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">Expert Team</h3>
                <p className="text-muted-foreground">
                  Dedicated team of certified architects, designers, and project management professionals.
                </p>
              </Card>
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">Client Support</h3>
                <p className="text-muted-foreground">
                  Ongoing support and maintenance guidance even after project completion.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Certifications & Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <Badge className="mb-4">{cert.name}</Badge>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portfolio Showcase */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Recent Portfolio Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                        View Project
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Expert Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{member.image}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.experience}</p>
                  <Badge variant="secondary" className="text-xs">{member.specialty}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <footer className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary-foreground" />
                  <span className="text-lg font-bold text-primary-foreground">Cedric House Planning</span>
                </div>
                <p className="text-sm">
                  Creating beautiful, functional house plans for your dream home.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">House Plans</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Modern Plans</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Traditional Plans</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Small House Plans</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Luxury Plans</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Custom Design</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Plan Modifications</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Construction Support</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Cost Estimates</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Contact Us</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">FAQ</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Shipping Info</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Returns</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm">
              <p className="mb-2">© 2024 Cedric House Planning and Construction. All rights reserved.</p>
              <p className="text-xs">Website Developers: <a href="#" className="text-red-400 hover:text-red-300 transition-opacity">TAD Developers</a></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
