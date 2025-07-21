import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogManagerProps {
  onEdit: (post: BlogPost) => void;
}

const BlogManager = ({ onEdit }: BlogManagerProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگیری مقالات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (postId: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published })
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId ? { ...post, published } : post
      ));

      toast({
        title: "موفق",
        description: published ? "مقاله منتشر شد" : "مقاله از انتشار خارج شد",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی مقاله",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "موفق",
        description: "مقاله حذف شد",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "خطا",
        description: "خطا در حذف مقاله",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">هنوز مقاله‌ای ایجاد نشده است.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2 flex-1">
                    {post.title}
                  </CardTitle>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "منتشر شده" : "پیش‌نویس"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">منتشر شده:</span>
                    <Switch
                      checked={post.published}
                      onCheckedChange={(checked) => togglePublished(post.id, checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف مقاله</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا از حذف این مقاله اطمینان دارید؟ این عمل قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>لغو</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePost(post.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="text-xs text-muted-foreground">
                  ایجاد: {new Date(post.created_at).toLocaleDateString("fa-IR")}
                  <br />
                  آخرین ویرایش: {new Date(post.updated_at).toLocaleDateString("fa-IR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;