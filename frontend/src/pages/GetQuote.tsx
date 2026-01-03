import { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Home, Palette, Bed, DollarSign, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';

const GetQuote = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    preferredStyle: '',
    customStyle: '',
    bedrooms: '',
    bathrooms: '',
    otherRooms: '',
    yardLength: '',
    yardBreadth: '',
    budget: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send data to backend API matching QuoteRequest model
      const quoteUrl = API_ENDPOINTS.QUOTES || 'http://localhost:8000/api/quote-request/';
      const response = await fetch(quoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          city: formData.city,
          preferred_style: formData.preferredStyle === 'Other' ? 'not_sure' : formData.preferredStyle.toLowerCase(),
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          other_required_rooms: formData.otherRooms,
          stand_length_meters: parseFloat(formData.yardLength) || 0,
          stand_breadth_meters: parseFloat(formData.yardBreadth) || 0,
          budget: formData.budget,
          project_description: formData.description,
        }),
      });

      if (response.ok) {
        // Show success message
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          // Reset form
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            city: '',
            preferredStyle: '',
            customStyle: '',
            bedrooms: '',
            bathrooms: '',
            otherRooms: '',
            yardLength: '',
            yardBreadth: '',
            budget: '',
            description: '',
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        alert('Error submitting quote: ' + (errorData.error || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting quote. Please check your connection and try again.');
    }
  };

  const styleOptions = [
    'Modern',
    'Contemporary',
    'Traditional',
    'Mediterranean',
    'Farmhouse',
    'Tuscan',
    'Tuscan Roof',
    'Minimalist',
    'Craftsman',
    'Colonial',
    'Ranch',
    'Victorian',
    'Not sure',
    'Other',
  ];

  const budgetOptions = [
    'R1,000 - R1,500',
    'R2,000 - R2,500',
    'R3,000 - R3,500',
    'R4,000 - R4,500',
    'R5,000 - R5,500',
    'R6,000 - R6,500',
    'R7,000 - R7,500',
    'R8,000 - R8,500',
    'R9,000 - R9,500',
    'R10,000+',
    'Not sure yet',
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Get Your FREE Custom Quote</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Tell us about your dream home and we'll provide a personalized design quote.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">100% Free</h3>
                  <p className="text-sm text-muted-foreground">No hidden charges or obligations</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">Get a quote within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Professional Team</h3>
                  <p className="text-sm text-muted-foreground">Expert architects will review your request</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {submitted ? (
                <Card className="p-12 text-center bg-green-50 border-green-200 animate-fade-in">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-800 mb-2">Request Sent Successfully! ✅</h2>
                  <p className="text-green-700 mb-6 text-lg">
                    Thank you for submitting your house plan quote request.
                  </p>
                  <div className="bg-white rounded-lg p-6 border-2 border-green-400 mb-6">
                    <p className="text-green-800 font-semibold mb-3">What happens next?</p>
                    <ul className="text-left text-green-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">1.</span>
                        <span>Your request has been saved to our admin panel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">2.</span>
                        <span>Our team will review your requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">3.</span>
                        <span>We'll contact you within 24 hours at the email or phone you provided</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Redirecting you back to the form in 3 seconds...
                  </p>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Details Section */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <span className="p-2 bg-primary/10 rounded">👤</span>
                      Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
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
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+27 (0) 123 456 789"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Your city"
                          required
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Design Preferences */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <span className="p-2 bg-primary/10 rounded">🎨</span>
                      Design Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Preferred Style *</label>
                        <select
                          name="preferredStyle"
                          value={formData.preferredStyle}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select a style</option>
                          {styleOptions.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                        {formData.preferredStyle === 'Other' && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-foreground mb-2">Describe Your Style *</label>
                            <Input
                              type="text"
                              name="customStyle"
                              value={formData.customStyle}
                              onChange={handleChange}
                              placeholder="e.g., Blend of Modern and Tuscan with minimalist interiors"
                              required
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Bedrooms *</label>
                            <Input
                              type="number"
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                              placeholder="e.g., 3"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Bathrooms *</label>
                            <Input
                              type="number"
                              name="bathrooms"
                              value={formData.bathrooms}
                              onChange={handleChange}
                              placeholder="e.g., 2"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">Other Required Rooms</label>
                      <Textarea
                        name="otherRooms"
                        value={formData.otherRooms}
                        onChange={handleChange}
                        placeholder="e.g., Home office, gym, guest suite, entertainment area..."
                        rows={3}
                      />
                    </div>
                  </Card>

                  {/* Property Details */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <span className="p-2 bg-primary/10 rounded">📐</span>
                      Property Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Stand/Yard Size *</label>
                        <p className="text-xs text-muted-foreground mb-4">Let's use length and breadth... Example: 20m x 30m</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-2">Length (m) *</label>
                            <Input
                              type="number"
                              name="yardLength"
                              value={formData.yardLength}
                              onChange={handleChange}
                              placeholder="e.g., 20"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-2">Breadth (m) *</label>
                            <Input
                              type="number"
                              name="yardBreadth"
                              value={formData.yardBreadth}
                              onChange={handleChange}
                              placeholder="e.g., 30"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Budget *</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select budget range</option>
                          {budgetOptions.map(budget => (
                            <option key={budget} value={budget}>{budget}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Description & Upload */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <span className="p-2 bg-primary/10 rounded">📝</span>
                      Tell Us More
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Project Description *</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your vision for the home, any specific features, lifestyle needs, or inspiration..."
                        rows={5}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        The more details you provide, the better we can understand your vision.
                      </p>
                    </div>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      <Send className="h-5 w-5" />
                      Submit Request
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    By submitting, you agree to our terms and will be contacted via WhatsApp/Email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

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
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="hover:opacity-80 transition-opacity">Home</a></li>
                  <li><a href="/house-plans" className="hover:opacity-80 transition-opacity">House Plans</a></li>
                  <li><a href="/built-homes" className="hover:opacity-80 transition-opacity">Built Homes</a></li>
                  <li><a href="/services" className="hover:opacity-80 transition-opacity">Services</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">More</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:opacity-80 transition-opacity">About</a></li>
                  <li><a href="/contact" className="hover:opacity-80 transition-opacity">Contact</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Custom Design</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Plan Modifications</a></li>
                  <li><a href="/get-quote" className="hover:opacity-80 transition-opacity">Get Quote</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-foreground mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="hover:opacity-80 transition-opacity">Contact Us</a></li>
                  <li><a href="https://wa.me/27726659790" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">WhatsApp</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity">Returns</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm">
              <p>© 2024 Cedric House Planning and Construction. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default GetQuote;
