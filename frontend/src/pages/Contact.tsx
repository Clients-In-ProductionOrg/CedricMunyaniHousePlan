import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Facebook, 
  MessageCircle, 
  Home, 
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';
import house4 from '@/assets/house4.jpg'; // Using house4 for diversity

const TikTokIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.35V2h-3.2v13.14a2.89 2.89 0 1 1-2-2.74V9.17a6.08 6.08 0 1 0 5.2 6V8.5a8.03 8.03 0 0 0 4.8 1.6V6.9c-.35 0-.7-.07-1.03-.2Z" />
  </svg>
);

interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  company_name: string;
  website_url: string;
  monday_friday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  updated_at: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Fetch site settings on component mount
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SITE_SETTINGS);
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submittedData = { ...formData };

    try {
        // API call logic
      const contactUrl = API_ENDPOINTS.CONTACTS;
      const response = await fetch(contactUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        const messageLines = [
          'Hello Cedric House Plan Team,',
          '',
          'I have submitted a contact request. Here are my details:',
          '',
          `*Full Name:* ${submittedData.name || 'N/A'}`,
          `*Email:* ${submittedData.email || 'N/A'}`,
          `*Phone Number:* ${submittedData.phone || 'N/A'}`,
          `*Subject:* ${submittedData.subject || 'N/A'}`,
          `*Message:* ${submittedData.message || 'N/A'}`,
        ];
        const whatsappText = encodeURIComponent(messageLines.join('\n'));
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=27726659790&text=${whatsappText}&type=phone_number&app_absent=0`;

        setShowSuccessModal(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        // Show success message first, then redirect automatically.
        setTimeout(() => {
          window.location.assign(whatsappUrl);
        }, 1500);

        // Auto-close modal
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        alert('Failed to send message: ' + (errorData.error || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = siteSettings ? [
    {
      icon: Phone,
      title: 'Phone Support',
      details: [siteSettings.phone || '0695885837'],
      link: `tel:${siteSettings.phone || '0695885837'}`,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [siteSettings.email || 'Cedrichouseplan@gmail.com'],
      link: `mailto:${siteSettings.email || 'Cedrichouseplan@gmail.com'}`,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: MapPin,
      title: 'Visit Office',
      details: [siteSettings.address || 'South Africa, Venda'],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [
        `Mon - Fri: ${siteSettings.monday_friday_hours || '9:00 AM - 6:00 PM'}`,
        `Saturday: ${siteSettings.saturday_hours || '10:00 AM - 4:00 PM'}`,
      ],
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ] : [
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['0695885837'],
      link: 'tel:0695885837',
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['Cedrichouseplan@gmail.com'],
      link: 'mailto:Cedrichouseplan@gmail.com',
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: MapPin,
      title: 'Visit Office',
      details: ['South Africa, Venda'],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      
      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-card border border-primary/20 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4 animate-in zoom-in-95 duration-300">
               <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold">Message Sent!</h3>
               <p className="text-muted-foreground">
                   Thank you for reaching out. Our team will get back to you within 24 hours.
               </p>
               <Button onClick={() => setShowSuccessModal(false)} className="w-full mt-4">
                   Close Message
               </Button>
           </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="relative h-[55vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-slate-900/80 z-10" />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
               <img 
                 src={house4} 
                 alt="Contact Cedric House Designs" 
                 className="w-full h-full object-cover object-center scale-105 animate-slow-zoom opacity-60"
               />
            </div>
            
            <div className="container relative z-30 px-4 text-center">
              <Badge className="mb-6 px-4 py-1.5 bg-primary/20 hover:bg-primary/20 text-primary border-primary/20 backdrop-blur-md">
                 24/7 Support Available
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                Let's Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Dream Reality
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Whether you have a specific project in mind or just want to explore possibilities, 
                our team represents the pinnacle of architectural service.
              </p>
            </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-24 pt-12 relative z-40 -mt-20">
             <div className="container px-4">
                 <div className="grid lg:grid-cols-5 gap-8">
                     
                     {/* Left Column: Contact Info & Socials */}
                     <div className="lg:col-span-2 space-y-6">
                         <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                             <h3 className="text-2xl font-bold mb-6">Contact Details</h3>
                             <div className="space-y-6">
                                 {contactInfo.map((info, idx) => {
                                     const Icon = info.icon;
                                     return (
                                         <a 
                                            key={idx} 
                                            href={info.link} 
                                            className={`flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group ${info.link ? 'cursor-pointer' : 'cursor-default'}`}
                                         >
                                             <div className={`mt-1 p-2.5 rounded-lg ${info.bg} ${info.color} group-hover:scale-110 transition-transform`}>
                                                 <Icon className="w-5 h-5" />
                                             </div>
                                             <div>
                                                 <h4 className="font-semibold text-foreground">{info.title}</h4>
                                                 {info.details.map((detail, i) => (
                                                     <p key={i} className="text-sm text-muted-foreground mt-1">{detail}</p>
                                                 ))}
                                             </div>
                                         </a>
                                     )
                                 })}
                             </div>

                             <div className="mt-8 pt-8 border-t border-border/50">
                                 <h4 className="font-semibold mb-4">Connect With Us</h4>
                                 <div className="flex gap-4">
                                     <a href="https://www.facebook.com/MPHOCEDRICHOUSEPLANS" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                         <Facebook className="w-5 h-5" />
                                     </a>
                                     <a href="https://www.tiktok.com/@cedrichouseplanning" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-600/10 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                       <TikTokIcon className="w-5 h-5" />
                                     </a>
                                     <a href="https://wa.me/27726659790" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-green-600/10 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                                         <MessageCircle className="w-5 h-5" />
                                     </a>
                                 </div>
                             </div>
                         </div>

                         {/* Mini FAQ Card */}
                         <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
                             <div className="flex items-center gap-3 mb-4">
                                 <HelpCircle className="w-6 h-6 text-primary" />
                                 <h3 className="font-bold text-lg">Quick FAQ</h3>
                             </div>
                             <div className="space-y-4">
                                 <div>
                                     <h4 className="font-medium text-sm">Do you offer free quotes?</h4>
                                     <p className="text-xs text-muted-foreground mt-1">Yes! Fill out the form or call us directly for a complimentary consultation.</p>
                                 </div>
                                 <div>
                                     <h4 className="font-medium text-sm">Can I customize existing plans?</h4>
                                     <p className="text-xs text-muted-foreground mt-1">Absolutely. All our plans are fully customizable to suit your plot and needs.</p>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Right Column: Contact Form */}
                     <div className="lg:col-span-3">
                         <Card className="border-none shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                             <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                             <CardContent className="p-8 md:p-10 flex-grow">
                                 <div className="mb-8">
                                     <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
                                     <p className="text-muted-foreground">
                                         Fill out the form below and our team will get back to you within 24 hours.
                                     </p>
                                 </div>

                                 <form onSubmit={handleSubmit} className="space-y-6">
                                     <div className="grid md:grid-cols-2 gap-6">
                                         <div className="space-y-2">
                                             <label className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
                                             <Input 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange}
                                                placeholder="John Doe" 
                                                className="h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                                required 
                                             />
                                         </div>
                                         <div className="space-y-2">
                                             <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
                                             <Input 
                                                name="email" 
                                                type="email"
                                                value={formData.email} 
                                                onChange={handleChange}
                                                placeholder="john@example.com" 
                                                className="h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                                required 
                                             />
                                         </div>
                                     </div>

                                     <div className="grid md:grid-cols-2 gap-6">
                                         <div className="space-y-2">
                                             <label className="text-sm font-medium text-muted-foreground ml-1">Phone Number</label>
                                             <Input 
                                                name="phone" 
                                                type="tel"
                                                value={formData.phone} 
                                                onChange={handleChange}
                                                placeholder="+27 00 000 0000" 
                                                className="h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                             />
                                         </div>
                                         <div className="space-y-2">
                                             <label className="text-sm font-medium text-muted-foreground ml-1">Subject</label>
                                             <Input 
                                                name="subject" 
                                                value={formData.subject} 
                                                onChange={handleChange}
                                                placeholder="Project Inquiry" 
                                                className="h-12 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                                required 
                                             />
                                         </div>
                                     </div>

                                     <div className="space-y-2">
                                         <label className="text-sm font-medium text-muted-foreground ml-1">Message</label>
                                         <Textarea 
                                            name="message" 
                                            value={formData.message} 
                                            onChange={handleChange}
                                            placeholder="Tell us about your project dream..." 
                                            className="min-h-[160px] bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all font-medium resize-none p-4"
                                            required 
                                         />
                                     </div>

                                     <Button 
                                       type="submit" 
                                       size="lg" 
                                       disabled={isSubmitting}
                                       className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-primary/25 transition-all"
                                     >
                                         {isSubmitting ? (
                                             <span className="flex items-center gap-2">
                                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                 Sending...
                                             </span>
                                         ) : (
                                             <span className="flex items-center gap-2">
                                                 Send Message <Send className="w-5 h-5" />
                                             </span>
                                         )}
                                     </Button>
                                 </form>
                             </CardContent>
                         </Card>
                     </div>
                 </div>
             </div>
        </section>

        {/* Extended Map Section */}
        <section className="bg-muted/30 py-24">
             <div className="container px-4 text-center">
                 <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
                 <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                     We are conveniently located in Venda, South Africa. Drop by for a cup of coffee and a chat about your future home.
                 </p>
                 
                 <div className="w-full h-[400px] bg-slate-200 rounded-3xl overflow-hidden shadow-inner relative group cursor-pointer">
                     {/* Placeholder Map Pattern */}
                     <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                         <div className="bg-white px-8 py-4 rounded-full shadow-xl flex items-center gap-3 animate-bounce">
                             <MapPin className="w-6 h-6 text-red-500 fill-current" />
                             <span className="font-bold text-slate-800">South Africa, Venda</span>
                         </div>
                     </div>
                 </div>
                 
                 <div className="mt-12 flex justify-center">
                     <Button variant="outline" size="lg" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                        Get Directions <ArrowRight className="w-4 h-4"/>
                     </Button>
                 </div>
             </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
