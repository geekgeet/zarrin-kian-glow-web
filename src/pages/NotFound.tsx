import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl text-foreground mb-6">صفحه یافت نشد</h2>
        <p className="text-muted-foreground mb-8">متأسفانه صفحه مورد نظر شما وجود ندارد.</p>
        <Button asChild>
          <Link to="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;