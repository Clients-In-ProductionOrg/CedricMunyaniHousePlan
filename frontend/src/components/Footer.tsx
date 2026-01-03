import { Home, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-footer-darker text-muted-foreground">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary-foreground">Cedric House Planning</span>
            </div>
            <p className="text-sm">
              Creating beautiful, functional house plans for your dream home.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">House Plans</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Modern Plans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Traditional Plans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Small House Plans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Luxury Plans</a></li>
            </ul>
          </div>
          
          <div id="services">
            <h3 className="font-semibold text-primary-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Custom Design</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Plan Modifications</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Construction Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cost Estimates</a></li>
            </ul>
          </div>
          
          <div id="about">
            <h3 className="font-semibold text-primary-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/20 text-center text-sm">
          <p className="mb-2">© 2024 Cedric House Planning and Construction. All rights reserved.</p>
          <p className="text-xs">Website Developers: <a href="#" className="text-red-600 hover:text-red-700 hover:underline">TAD Developers</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
