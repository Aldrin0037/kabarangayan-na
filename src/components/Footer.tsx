import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    services: [
      "Document Services",
      "Health Programs", 
      "Education Support",
      "Public Works",
      "Social Services",
      "Peace & Order"
    ],
    quickLinks: [
      "About Us",
      "Our Officials", 
      "News & Updates",
      "Contact Us",
      "Emergency Services",
      "Online Services"
    ],
    community: [
      "Community Events",
      "Volunteer Programs",
      "Youth Development",
      "Senior Citizen Programs",
      "Women's Programs",
      "Environmental Initiatives"
    ]
  };

  return (
    <footer className="bg-civic-navy text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Barangay Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Barangay San Miguel</h3>
                <p className="text-sm text-primary-foreground/80">Serving the Community</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Committed to providing excellent public service and fostering community development 
              through transparent governance and active citizen participation.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#services" 
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-smooth"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-smooth"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-primary-foreground/80" />
                <div className="text-sm text-primary-foreground/80">
                  <p>123 Barangay Road</p>
                  <p>Quezon City, Metro Manila</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground/80">(02) 8123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground/80">info@sanmiguel.gov.ph</span>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-primary-foreground/10 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">Office Hours</h5>
              <p className="text-xs text-primary-foreground/80">Mon-Fri: 8:00 AM - 5:00 PM</p>
              <p className="text-xs text-primary-foreground/80">Sat: 8:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-foreground/80">
              <p>&copy; 2024 Barangay San Miguel. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-1 text-sm text-primary-foreground/80">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>for our community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;