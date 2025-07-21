import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Zap, Battery } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Sun,
      title: "نیروگاه خورشیدی",
      description: "طراحی و نصب نیروگاه‌های خورشیدی با بازدهی بالا"
    },
    {
      icon: Zap,
      title: "انرژی پاک",
      description: "تولید برق پاک و سازگار با محیط زیست"
    },
    {
      icon: Battery,
      title: "ذخیره انرژی",
      description: "سیستم‌های ذخیره‌سازی انرژی برای استفاده مداوم"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">خدمات ما</h2>
          <div className="w-24 h-1 bg-gradient-electric mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-electric transition-all duration-300">
              <CardHeader>
                <service.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;