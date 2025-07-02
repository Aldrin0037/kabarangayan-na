import { Users, Home, Building2, MapPin } from "lucide-react";

const Statistics = () => {
  const stats = [
    {
      icon: Users,
      value: "15,342",
      label: "Total Population",
      description: "Registered residents in our barangay"
    },
    {
      icon: Home,
      value: "3,847",
      label: "Households",
      description: "Families we proudly serve"
    },
    {
      icon: Building2,
      value: "1,256",
      label: "Establishments",
      description: "Local businesses and enterprises"
    },
    {
      icon: MapPin,
      value: "12.5",
      label: "Square Kilometers",
      description: "Total area coverage"
    }
  ];

  return (
    <section className="py-16 bg-civic-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Barangay by the Numbers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A snapshot of our vibrant community and the scope of our services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-8 text-center shadow-card hover:shadow-strong transition-smooth group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6 group-hover:scale-110 transition-smooth">
                <stat.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
              <h4 className="text-lg font-semibold text-foreground mb-2">{stat.label}</h4>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;