import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BlogManager from "@/components/admin/BlogManager";
import ContactManager from "@/components/admin/ContactManager";
import BlogEditor from "@/components/admin/BlogEditor";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("blog");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "خروج موفق",
        description: "با موفقیت از سیستم خارج شدید.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "خطا",
        description: "خطا در خروج از سیستم",
        variant: "destructive",
      });
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onClose={handleCloseEditor}
        onSave={() => {
          handleCloseEditor();
          // Refresh the blog list
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">پنل مدیریت</h1>
            <p className="text-muted-foreground mt-2">خوش آمدید، {user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="w-4 h-4 mr-2" />
            خروج
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog">مدیریت بلاگ</TabsTrigger>
            <TabsTrigger value="contacts">درخواست‌های تماس</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">مقالات بلاگ</h2>
              <Button onClick={handleNewPost}>
                <Plus className="w-4 h-4 mr-2" />
                مقاله جدید
              </Button>
            </div>
            <BlogManager onEdit={handleEditPost} />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">درخواست‌های تماس</h2>
            <ContactManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;