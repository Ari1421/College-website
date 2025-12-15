import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';
import { Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';

export default function CollegesByType() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isAdmin } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (type) {
      fetchCollegesByType();
    }
  }, [type]);

  const fetchCollegesByType = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .eq('college_type', type as any)
      .order('name');
    
    if (data) setColleges(data);
    setLoading(false);
  };

  const getTypeTitle = (type: string) => {
    const titles: Record<string, string> = {
      engineering: 'Engineering Colleges',
      medical: 'Medical Colleges',
      arts: 'Arts & Science Colleges',
      law: 'Law Colleges',
      dental: 'Dental Colleges',
      pharmacy: 'Pharmacy Colleges',
      agriculture: 'Agriculture Colleges',
      veterinary: 'Veterinary Colleges',
      polytechnic: 'Polytechnic Colleges',
      management: 'Management Colleges',
      education: 'Education Colleges',
    };
    return titles[type || ''] || 'Colleges';
  };

  const getCollegeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      medical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      arts: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      law: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      dental: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      pharmacy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      agriculture: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
      veterinary: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      polytechnic: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      management: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      education: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{getTypeTitle(type || '')}</h1>
          <p className="text-muted-foreground">
            Found {colleges.length} {type} college{colleges.length !== 1 ? 's' : ''} in Tamil Nadu
          </p>
        </div>

        {colleges.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No colleges found in this category yet.</p>
            <Button onClick={() => navigate('/dashboard')}>Add First College</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card
                key={college.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/college/${college.id}`)}
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
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
                  <h3 className="font-semibold text-lg line-clamp-2">{college.name}</h3>
                  <Badge className={getCollegeTypeColor(college.college_type)}>
                    {college.college_type}
                  </Badge>
                  {college.address && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {college.address}
                    </p>
                  )}
                  {(college.infrastructure_rating || college.placement_rating) && (
                    <div className="flex gap-3">
                      {college.infrastructure_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm">{college.infrastructure_rating}/5</span>
                        </div>
                      )}
                      {college.placement_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm">{college.placement_rating}/5</span>
                        </div>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
                  fetchCollegesByType();
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
