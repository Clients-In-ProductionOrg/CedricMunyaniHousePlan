import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, Clock, MapPin, Facebook, MessageCircle, Music, Home } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';

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

    try {
      const contactUrl = API_ENDPOINTS.CONTACTS || 'http://localhost:8000/api/contact-message/';
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
        // Show success modal
        setShowSuccessModal(true);
        // Reset form
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        // Auto-close modal and countdown
        let countdown = 5;
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown === 0) {
            clearInterval(interval);
            setShowSuccessModal(false);
          }
        }, 1000);
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
      title: 'Phone',
      details: [siteSettings.phone || '0695885837'],
      link: `tel:${siteSettings.phone || '0695885837'}`,
    },
    {
      icon: Mail,
      title: 'Email',
      details: [siteSettings.email || 'Cedrichouseplan@gmail.com'],
      link: `mailto:${siteSettings.email || 'Cedrichouseplan@gmail.com'}`,
    },
    {
      icon: MapPin,
      title: 'Address',
      details: [siteSettings.address || 'South Africa, Venda'],
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      details: [
        `Monday - Friday: ${siteSettings.monday_friday_hours || '9:00 AM - 6:00 PM'}`,
        `Saturday: ${siteSettings.saturday_hours || '10:00 AM - 4:00 PM'}`,
        `Sunday: ${siteSettings.sunday_hours || 'Closed'}`,
      ],
    },
  ] : [
    {
      icon: Phone,
      title: 'Phone',
      details: ['0695885837'],
      link: 'tel:0695885837',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['Cedrichouseplan@gmail.com'],
      link: 'mailto:Cedrichouseplan@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['South Africa, Venda'],
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://www.facebook.com/MPHOCEDRICHOUSEPLANS',
      label: 'Follow us on Facebook',
    },
    {
      icon: Music,
      name: 'TikTok',
      url: 'https://www.tiktok.com/@cedrichouseplanning?is_from_webapp=1&sender_device=pc',
      label: 'Follow us on TikTok',
    },
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      url: 'https://wa.me/0695885837',
      label: 'Message us on WhatsApp',
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Have a question or ready to start your dream home project? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {info.link ? (
                              <a href={info.link} className="hover:text-primary transition-colors">
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content: Contact Form and Map */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+27 (0) 123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your project..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Map and Social Links */}
              <div className="space-y-8">
                {/* Google Map */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Our Location</h2>
                  <div className="rounded-lg overflow-hidden shadow-lg h-96">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.8225261649926!2d25.748486!3d-28.2341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95a5c0e0e0e0ed%3A0x0!2sSouth%20Africa!5e0!3m2!1sen!2s!4v1234567890"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Connect With Us</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-background border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all"
                        >
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{social.name}</h3>
                            <p className="text-sm text-muted-foreground">{social.label}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* WhatsApp CTA Button */}
                <a
                  href={`https://wa.me/${(siteSettings?.phone || '0695885837').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-4">
              <div className="text-center">
                <div className="mb-4 text-5xl">✅</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Message Sent Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out to us. Our team will review your message and get back to you within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground">Redirecting in a few seconds...</p>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
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
                  <a href="https://www.facebook.com/MPHOCEDRICHOUSEPLANS" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="https://www.tiktok.com/@cedrichouseplanning?lang=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Music className="h-5 w-5" />
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

export default Contact;
