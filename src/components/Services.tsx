import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Heart, 
  GraduationCap, 
  Truck, 
  Users,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "Document Services",
      description: "Barangay clearance, certificates, permits, and other official documents issued quickly and efficiently through our online system.",
      features: ["Barangay Clearance", "Certificate of Indigency", "Business Permit", "Certificate of Residency", "Barangay ID"],
      link: "/login"
    },
    {
      icon: Shield,
      title: "Peace & Order",
      description: "24/7 security services, crime prevention programs, and community safety initiatives.",
      features: ["Barangay Tanod", "CCTV Monitoring", "Safety Patrols", "Emergency Response"]
    },
    {
      icon: Heart,
      title: "Health Services",
      description: "Comprehensive healthcare programs, medical assistance, and wellness initiatives for all residents.",
      features: ["Medical Assistance", "Health Programs", "Senior Citizen Care", "Vaccination Drives"]
    },
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Educational assistance, scholarship programs, and learning facilities for students of all ages.",
      features: ["Scholarship Programs", "School Supplies", "Tutorial Services", "Skills Training"]
    },
    {
      icon: Truck,
      title: "Public Works",
      description: "Infrastructure development, road maintenance, and community facility improvements.",
      features: ["Road Maintenance", "Drainage Systems", "Street Lighting", "Park Development"]
    },
    {
      icon: Users,
      title: "Social Services",
      description: "Community programs, livelihood assistance, and support for vulnerable sectors.",
      features: ["Livelihood Programs", "Senior Citizen Benefits", "PWD Support", "Youth Development"]
    }
  ];

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive services designed to meet the diverse needs of our community members
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-strong transition-smooth border-border">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 mx-auto group-hover:scale-110 transition-smooth">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center justify-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="group w-full"
                  onClick={() => service.link ? window.location.href = service.link : null}
                >
                  {service.link && service.title === "Document Services" ? "Apply Now" : "Learn More"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;