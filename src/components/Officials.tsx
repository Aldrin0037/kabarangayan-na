import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail } from "lucide-react";

const Officials = () => {
  const officials = [
    {
      name: "Maria Santos Rodriguez",
      position: "Barangay Captain",
      email: "captain@sanmiguel.gov.ph",
      phone: "(02) 8123-4567",
      term: "2023-2026"
    },
    {
      name: "Juan Carlos Dela Cruz",
      position: "Barangay Kagawad - Finance",
      email: "finance@sanmiguel.gov.ph", 
      phone: "(02) 8123-4568",
      term: "2023-2026"
    },
    {
      name: "Ana Marie Gonzales",
      position: "Barangay Kagawad - Health",
      email: "health@sanmiguel.gov.ph",
      phone: "(02) 8123-4569",
      term: "2023-2026"
    },
    {
      name: "Roberto Miguel Santos",
      position: "Barangay Kagawad - Education",
      email: "education@sanmiguel.gov.ph",
      phone: "(02) 8123-4570",
      term: "2023-2026"
    },
    {
      name: "Carmen Luna Reyes",
      position: "Barangay Kagawad - Public Works",
      email: "works@sanmiguel.gov.ph",
      phone: "(02) 8123-4571",
      term: "2023-2026"
    },
    {
      name: "Eduardo Jose Villanueva",
      position: "Barangay Kagawad - Peace & Order",
      email: "security@sanmiguel.gov.ph",
      phone: "(02) 8123-4572",
      term: "2023-2026"
    },
    {
      name: "Lisa Marie Aquino",
      position: "SK Chairperson",
      email: "sk@sanmiguel.gov.ph",
      phone: "(02) 8123-4573",
      term: "2023-2026"
    },
    {
      name: "Patricia Cruz Mendoza",
      position: "Barangay Secretary",
      email: "secretary@sanmiguel.gov.ph",
      phone: "(02) 8123-4574",
      term: "2023-2026"
    }
  ];

  return (
    <section id="officials" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Barangay Officials
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet our dedicated leaders committed to serving the San Miguel community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {officials.map((official, index) => (
            <Card key={index} className="group hover:shadow-card transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-smooth">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                
                <h3 className="font-bold text-lg text-foreground mb-1">{official.name}</h3>
                <Badge variant="secondary" className="mb-4">
                  {official.position}
                </Badge>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{official.email}</span>
                  </div>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{official.phone}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    Term: {official.term}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Officials;