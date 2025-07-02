import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: [
        "123 Barangay Road, San Miguel",
        "Quezon City, Metro Manila",
        "Philippines 1100"
      ]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "Main Office: (02) 8123-4567",
        "Emergency: (02) 8123-4568",
        "Mobile: +63 917 123 4567"
      ]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@sanmiguel.gov.ph",
        "services@sanmiguel.gov.ph",
        "emergency@sanmiguel.gov.ph"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 8:00 AM - 12:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const quickLinks = [
    { name: "Online Services Portal", url: "#", icon: MessageCircle },
    { name: "Document Request", url: "#", icon: Mail },
    { name: "Report an Issue", url: "#", icon: Phone },
    { name: "Emergency Hotline", url: "#", icon: Phone }
  ];

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're here to serve you. Reach out to us for any assistance, inquiries, or feedback.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <Card key={index} className="hover:shadow-card transition-smooth">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                        <item.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => (
                    <Button key={index} variant="outline" className="h-auto p-4 justify-start">
                      <link.icon className="h-5 w-5 mr-3" />
                      <span>{link.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Social Media */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Interactive map coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Facebook className="h-5 w-5 mr-3" />
                    Barangay San Miguel Official
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    SMS Alerts: Text SANMIGUEL to 2366
                  </Button>
                </div>
                <div className="mt-6 p-4 bg-civic-light rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Emergency Contacts</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Fire: 116</p>
                    <p>Police: 117</p>
                    <p>Barangay Emergency: (02) 8123-4568</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;