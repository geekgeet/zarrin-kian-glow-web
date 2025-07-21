import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  published: boolean;
}

interface BlogEditorProps {
  post?: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

const BlogEditor = ({ post, onClose, onSave }: BlogEditorProps) => {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    image_url: post?.image_url || "",
    published: post?.published || false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفا فقط فایل تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({
        title: "موفق",
        description: "تصویر با موفقیت آپلود شد",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطا",
        description: "خطا در آپلود تصویر",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "خطا",
        description: "عنوان و محتوا الزامی هستند",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const postData = {
        ...formData,
        author_id: session.user.id,
      };

      let error;
      if (post?.id) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);
        error = updateError;
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert([postData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "موفق",
        description: post?.id ? "مقاله به‌روزرسانی شد" : "مقاله جدید ایجاد شد",
      });
      onSave();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره مقاله",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {post?.id ? "ویرایش مقاله" : "مقاله جدید"}
          </h1>
          <Button onClick={onClose} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            بازگشت
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات مقاله</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                placeholder="عنوان مقاله را وارد کنید"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">خلاصه</Label>
              <Textarea
                id="excerpt"
                placeholder="خلاصه‌ای از مقاله برای نمایش در لیست مقالات"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>تصویر شاخص</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "در حال آپلود..." : "انتخاب تصویر"}
                </Button>
                {formData.image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {formData.image_url && (
                <div className="mt-4">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="max-w-xs h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">محتوا</Label>
              <Textarea
                id="content"
                placeholder="محتوای کامل مقاله را وارد کنید"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
              />
            </div>

            {/* Published */}
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published">انتشار مقاله</Label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </Button>
              <Button onClick={onClose} variant="outline">
                لغو
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogEditor;