import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-dark border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">خورشید زرین کیان</h1>
          <Button asChild variant="outline">
            <Link to="/auth">پنل مدیریت</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;