import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, FileText } from "lucide-react";
import heroImage from "@/assets/barangay-hero.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative py-20 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Welcome to
              <span className="block text-primary-glow">Barangay San Miguel</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Your trusted local government unit dedicated to serving our community with 
              excellence, transparency, and unwavering commitment to progress and development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="civic" size="lg" className="group">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Barangay San Miguel Building" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-card">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8" />
                <div>
                  <p className="font-bold text-2xl">15,342</p>
                  <p className="text-sm">Residents Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;