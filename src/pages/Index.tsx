import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Blog from "@/components/Blog";
import ContactForm from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Blog />
      <ContactForm />
    </div>
  );
};

export default Index;