import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Mail, Phone, Building } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  created_at: string;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگیری درخواست‌های تماس",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", contactId);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== contactId));
      toast({
        title: "موفق",
        description: "درخواست حذف شد",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "خطا",
        description: "خطا در حذف درخواست",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">هنوز درخواست تماسی دریافت نشده است.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{contact.name}</span>
                  <Badge variant="outline">
                    {new Date(contact.created_at).toLocaleDateString("fa-IR")}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  
                  {contact.company && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {contact.message}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        مشاهده
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>جزئیات درخواست تماس</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">اطلاعات تماس:</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>نام:</strong> {contact.name}</p>
                            <p><strong>ایمیل:</strong> {contact.email}</p>
                            {contact.phone && <p><strong>تلفن:</strong> {contact.phone}</p>}
                            {contact.company && <p><strong>شرکت:</strong> {contact.company}</p>}
                            <p><strong>تاریخ:</strong> {new Date(contact.created_at).toLocaleDateString("fa-IR")}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">پیام:</h4>
                          <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                            {contact.message}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف درخواست</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا از حذف این درخواست تماس اطمینان دارید؟ این عمل قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>لغو</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteContact(contact.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManager;