import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, 
} from '@/components/ui/select';
import { 
    CheckCircle2, 
    Send, 
    Building, 
    Ruler, 
    Wallet, 
    FileText, 
    User,
    Sparkles,
    ShieldCheck,
    Clock,
    ArrowRight,
    X
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';
import house3 from '@/assets/house3.jpg';

type OtherRoomItem = {
    name: string;
    quantity: number;
};

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
    const [otherRoomSelection, setOtherRoomSelection] = useState('');
    const [otherRoomQuantity, setOtherRoomQuantity] = useState('1');
    const [otherRoomsList, setOtherRoomsList] = useState<OtherRoomItem[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submittedData = { ...formData };

        if (!submittedData.budget) {
            alert('Please select your budget range before submitting.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.QUOTES, {
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
                const styleLabel = submittedData.preferredStyle === 'Other'
                    ? (submittedData.customStyle || 'Other')
                    : (submittedData.preferredStyle || 'Not sure');
                const messageLines = [
                    'Hello Cedric House Plan Team,',
                    '',
                    'I have submitted a quotation request. Here are my details:',
                    '',
                    '*Full Name:* ' + (submittedData.fullName || 'N/A'),
                    '*Email:* ' + (submittedData.email || 'N/A'),
                    '*Phone Number:* ' + (submittedData.phone || 'N/A'),
                    '*City:* ' + (submittedData.city || 'N/A'),
                    '*Preferred Style:* ' + styleLabel,
                    '*Bedrooms:* ' + (submittedData.bedrooms || 'N/A'),
                    '*Bathrooms:* ' + (submittedData.bathrooms || 'N/A'),
                    '*Other Required Rooms:* ' + (submittedData.otherRooms || 'N/A'),
                    '*Stand Length (m):* ' + (submittedData.yardLength || 'N/A'),
                    '*Stand Breadth (m):* ' + (submittedData.yardBreadth || 'N/A'),
                    '*Budget Range:* ' + (budgetOptions.find((option) => option.value === submittedData.budget)?.label || submittedData.budget || 'N/A'),
                    '*Project Description:* ' + (submittedData.description || 'N/A'),
                ];
                const whatsappText = encodeURIComponent(messageLines.join('\n'));
                const whatsappUrl = `https://api.whatsapp.com/send/?phone=27726659790&text=${whatsappText}&type=phone_number&app_absent=0`;

                setSubmitted(true);
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
                setOtherRoomSelection('');
                setOtherRoomQuantity('1');
                setOtherRoomsList([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.location.assign(whatsappUrl);
            } else {
                const errorData = await response.json();
                alert('Error submitting quote: ' + (errorData.error || 'Please try again.'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting quote. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styleOptions = [
        'Modern', 'Contemporary', 'Traditional', 'Mediterranean', 'Farmhouse',
        'Tuscan', 'Tuscan Roof', 'Minimalist', 'Craftsman', 'Colonial',
        'Ranch', 'Victorian', 'Not sure', 'Other',
    ];

    const otherRoomOptions = [
        'Kitchen',
        'Lounge',
        'Dining',
        'Garage',
        'Bathroom',
        'En suite',
        'Laundry',
        'Scullery',
        'Office',
    ];

    const handleAddOtherRoom = (room: string) => {
        const normalizedRoom = room.trim();
        if (!normalizedRoom) return;

        const parsedQuantity = Number.parseInt(otherRoomQuantity, 10);
        const quantity = Number.isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;

        const updatedRooms = (() => {
            const existing = [...otherRoomsList];
            const existingIndex = existing.findIndex((item) => item.name === normalizedRoom);

            if (existingIndex >= 0) {
                existing[existingIndex] = {
                    ...existing[existingIndex],
                    quantity: existing[existingIndex].quantity + quantity,
                };
                return existing;
            }

            return [...existing, { name: normalizedRoom, quantity }];
        })();

        setOtherRoomsList(updatedRooms);
        setFormData((prev) => ({
            ...prev,
            otherRooms: updatedRooms.map((item) => `${item.name} x${item.quantity}`).join(', '),
        }));
        setOtherRoomSelection('');
        setOtherRoomQuantity('1');
    };

    const handleRemoveOtherRoom = (roomToRemove: string) => {
        const updatedRooms = otherRoomsList.filter((item) => item.name !== roomToRemove);
        setOtherRoomsList(updatedRooms);
        setFormData((prev) => ({
            ...prev,
            otherRooms: updatedRooms.map((item) => `${item.name} x${item.quantity}`).join(', '),
        }));
    };

    const budgetOptions = [
        { value: 'under_500k', label: '500 - 1500' },
        { value: '500k_1m', label: '1500 - 3500' },
        { value: '1m_2m', label: '3500 - 4500' },
        { value: '2m_3m', label: '4500 - 5500' },
        { value: '3m_5m', label: '5500 - 7000' },
        { value: 'above_5m', label: '7000 - 10000' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
            <Header />
            
            <main className="flex-grow pb-24">
                {/* Immersive Hero Section */}
                <section className="relative h-[55vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-slate-900/80 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent z-20" />
                        <img 
                            src={house3} 
                            alt="Get a Quote" 
                            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom opacity-60"
                        />
                    </div>
                    
                    <div className="container relative z-30 px-4 text-center">
                        <Badge className="mb-6 px-4 py-1.5 bg-primary/20 hover:bg-primary/20 text-primary border-primary/20 backdrop-blur-md animate-in fade-in zoom-in duration-500">
                            Start Your Journey
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Build Your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400">
                                Dream Reality
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-light">
                            Tell us about your vision. Our expert architects will craft a personalized proposal for your future home.
                        </p>
                    </div>
                </section>

                {/* Trust Indicators - Floating Cards */}
                <section className="container px-4 relative z-40 -mt-20 mb-20">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                                icon: ShieldCheck, 
                                title: 'No Obligation', 
                                desc: '100% Free professional estimate.',
                                color: 'text-emerald-500',
                                bg: 'bg-emerald-500/10'
                            },
                            { 
                                icon: Clock, 
                                title: '24h Turnaround', 
                                desc: 'Get your detailed quote fast.',
                                color: 'text-blue-500',
                                bg: 'bg-blue-500/10'
                            },
                            { 
                                icon: Sparkles, 
                                title: 'Architect Reviewed', 
                                desc: 'Analyzed by senior professionals.',
                                color: 'text-purple-500',
                                bg: 'bg-purple-500/10'
                            }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-card/95 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-6 shadow-2xl flex items-start gap-5 hover:translate-y-[-4px] transition-all duration-300 group">
                                    <div className={`p-4 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Main Form Area */}
                <section className="container px-4 max-w-5xl mx-auto">
                    {submitted ? (
                        <Card className="border-none shadow-2xl bg-card overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-green-500/20">
                            <CardContent className="p-12 md:p-20 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/5 z-0" />
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30 animate-in zoom-in duration-500">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-foreground mb-4">Request Received!</h2>
                                    <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
                                        We've received your details. Our architects are already sharpening their pencils.
                                    </p>
                                    
                                    <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 text-left max-w-md mx-auto shadow-sm mb-8">
                                        <h4 className="font-semibold mb-6 text-foreground text-center">What Happens Next?</h4>
                                        <ul className="space-y-4">
                                            {[
                                                'Expert Analysis of your requirements',
                                                'Preparation of detailed cost estimate',
                                                'Personal contact via WhatsApp/Email'
                                            ].map((step, i) => (
                                                <li key={i} className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold ring-1 ring-primary/20">
                                                        {i + 1}
                                                    </span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Button 
                                        onClick={() => setSubmitted(false)} 
                                        size="lg"
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        Submit Another Request <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Navigation Sidebar (Desktop) */}
                            <div className="hidden lg:block w-64 flex-shrink-0 space-y-2 sticky top-24 h-fit">
                                <h3 className="font-semibold text-lg px-4 mb-4">Your Quote</h3>
                                {[
                                    { id: 0, icon: User, label: "Personal Details" },
                                    { id: 1, icon: Building, label: "Design Preferences" },
                                    { id: 2, icon: Ruler, label: "Property & Budget" }
                                ].map((step) => (
                                    <div 
                                        key={step.id}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                            activeSection === step.id 
                                            ? 'bg-primary/10 text-primary font-medium' 
                                            : 'text-muted-foreground'
                                        }`}
                                    >
                                        <step.icon className="w-4 h-4" />
                                        {step.label}
                                    </div>
                                ))}
                            </div>

                            {/* Form Content */}
                            <div className="flex-grow">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    
                                    {/* Section 1: Personal Info */}
                                    <Card 
                                        className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                        onMouseEnter={() => setActiveSection(0)}
                                    >
                                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">Personal Details</h3>
                                                    <p className="text-sm text-muted-foreground">Who should we address the quote to?</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Full Name</Label>
                                                    <Input
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="e.g. John Doe"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address</Label>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone Number</Label>
                                                    <Input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+27 72 000 0000"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">City / Location</Label>
                                                    <Input
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        placeholder="e.g. Pretoria"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Section 2: Design Preferences */}
                                    <Card 
                                        className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                        onMouseEnter={() => setActiveSection(1)}
                                    >
                                        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
                                                    <Building className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">Design Preferences</h3>
                                                    <p className="text-sm text-muted-foreground">Tell us about your style.</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Preferred Style</Label>
                                                    <Select onValueChange={(val) => handleSelectChange('preferredStyle', val)}>
                                                        <SelectTrigger className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background">
                                                            <SelectValue placeholder="Select a style" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {styleOptions.map(style => (
                                                                <SelectItem key={style} value={style}>{style}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                {formData.preferredStyle === 'Other' && (
                                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Describe Style</Label>
                                                        <Input
                                                            name="customStyle"
                                                            value={formData.customStyle}
                                                            onChange={handleChange}
                                                            placeholder="e.g. Modern Barnhouse"
                                                            className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Bedrooms</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        name="bedrooms"
                                                        value={formData.bedrooms}
                                                        onChange={handleChange}
                                                        placeholder="3"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Bathrooms</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        name="bathrooms"
                                                        value={formData.bathrooms}
                                                        onChange={handleChange}
                                                        placeholder="2"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Other Required Rooms</Label>
                                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_110px_auto] gap-3">
                                                    <Select value={otherRoomSelection} onValueChange={setOtherRoomSelection}>
                                                        <SelectTrigger className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background">
                                                            <SelectValue placeholder="Select room" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {otherRoomOptions.map((room) => (
                                                                <SelectItem key={room} value={room}>
                                                                    {room}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={otherRoomQuantity}
                                                        onChange={(e) => setOtherRoomQuantity(e.target.value)}
                                                        placeholder="Qty"
                                                        className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-12"
                                                        onClick={() => handleAddOtherRoom(otherRoomSelection)}
                                                        disabled={!otherRoomSelection}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>

                                                {otherRoomsList.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {otherRoomsList.map((room) => (
                                                            <Badge key={room.name} variant="secondary" className="pl-3 pr-2 py-1.5 gap-2">
                                                                {room.name} x{room.quantity}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveOtherRoom(room.name)}
                                                                    className="rounded-full hover:bg-black/10 p-0.5"
                                                                    aria-label={`Remove ${room.name}`}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Section 3: Property & Budget */}
                                    <Card 
                                        className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                        onMouseEnter={() => setActiveSection(2)}
                                    >
                                        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600">
                                                    <Ruler className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">Property & Checks</h3>
                                                    <p className="text-sm text-muted-foreground">Constraints & Requirements.</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                <div>
                                                    <Label className="block mb-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Stand Dimensions (Metres)</Label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="number"
                                                                name="yardLength"
                                                                value={formData.yardLength}
                                                                onChange={handleChange}
                                                                placeholder="Length"
                                                                className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="number"
                                                                name="yardBreadth"
                                                                value={formData.yardBreadth}
                                                                onChange={handleChange}
                                                                placeholder="Breadth"
                                                                className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                                        Estimated Budget
                                                    </Label>
                                                    <Select onValueChange={(val) => handleSelectChange('budget', val)}>
                                                        <SelectTrigger className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background">
                                                            <SelectValue placeholder="Select Range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {budgetOptions.map(option => (
                                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                                    Additional Details
                                                </Label>
                                                <Textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Describe your vision in detail..."
                                                    className="min-h-[150px] resize-y bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                                                    required
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Button 
                                        type="submit" 
                                        size="lg" 
                                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-xl"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-3">
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing Request...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                Submit Quote Request <Send className="w-5 h-5" />
                                            </span>
                                        )}
                                    </Button>
                                    
                                    <p className="text-center text-xs text-muted-foreground/60">
                                        By clicking submit, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GetQuote;
