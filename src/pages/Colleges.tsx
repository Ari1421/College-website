import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Trash } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Colleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const navigate = useNavigate();
  const { isAdmin } = useSession();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllColleges();
  }, []);

  const fetchAllColleges = async () => {
    const { data } = await supabase.from('colleges').select('*').order('name');
    if (data) setColleges(data);
  };

  const getCollegeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      engineering: 'bg-blue-100 text-blue-800',
      medical: 'bg-red-100 text-red-800',
      arts: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Colleges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/college/${college.id}`)}>
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'} alt={college.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 space-y-3 relative">
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); setDeletingId(college.id); }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
                <h3 className="font-semibold text-lg line-clamp-1">{college.name}</h3>
                <Badge className={getCollegeTypeColor(college.college_type)}>{college.college_type}</Badge>
                {college.address && <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1"><MapPin className="h-4 w-4 mt-0.5" />{college.address}</p>}
                {college.infrastructure_rating && <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /><span className="text-sm">{college.infrastructure_rating}/5</span></div>}
                <Button variant="outline" className="w-full">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete College?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the college.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deletingId) return;
                try {
                  const { error } = await supabase.from('colleges').delete().eq('id', deletingId);
                  if (error) throw error;
                  toast({ title: 'Deleted', description: 'College deleted successfully' });
                  setDeletingId(null);
                  fetchAllColleges();
                } catch (error: any) {
                  toast({ title: 'Error', description: error.message || 'Failed to delete college', variant: 'destructive' });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}