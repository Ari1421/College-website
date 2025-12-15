import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Calendar, Award, Star, Building, Edit, Plus, Pencil, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollegeForm } from '@/components/CollegeForm';
import { DepartmentForm } from '@/components/DepartmentForm';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { RoleGate } from '@/components/RoleGate';
import { useSession } from '@/hooks/useSession';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type College = {
  id: string;
  name: string;
  college_type: Database['public']['Enums']['college_type'];
  counseling_code: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  established_year: number | null;
  affiliation: string | null;
  accreditation: string | null;
  infrastructure_rating: number | null;
  placement_rating: number | null;
  description: string | null;
  image_url: string | null;
};

type Department = {
  id: string;
  name: string;
  hod_name: string | null;
  intake_capacity: number | null;
};

export default function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useSession();
  const [deletingCollege, setDeletingCollege] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
      fetchDepartments();
    }
  }, [id]);

  const fetchCollegeDetails = async () => {
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (data) setCollege(data);
    setLoading(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    fetchCollegeDetails();
  };

  const fetchDepartments = async () => {
    const { data } = await supabase
      .from('departments')
      .select('*')
      .eq('college_id', id)
      .order('name');
    
    if (data) setDepartments(data);
  };

  const handleDeptSuccess = () => {
    setDeptDialogOpen(false);
    setEditingDept(null);
    fetchDepartments();
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptDialogOpen(true);
  };

  const handleDeleteDept = async (deptId: string) => {
    try {
      const { error } = await supabase.from('departments').delete().eq('id', deptId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Department deleted successfully' });
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department',
        variant: 'destructive'
      });
    }
    setDeletingDeptId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">College not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getCollegeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      medical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      arts: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      law: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      management: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <RoleGate allow="admin">
            <div className="flex items-center gap-2">
              <Button onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit College
              </Button>
              <Button variant="destructive" onClick={() => setDeletingCollege(true)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete College
              </Button>
            </div>
          </RoleGate>
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg mb-8 bg-muted">
          <img
            src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600'}
            alt={college.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* College Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{college.name}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCollegeTypeColor(college.college_type)}>
                      {college.college_type.charAt(0).toUpperCase() + college.college_type.slice(1)}
                    </Badge>
                    {college.counseling_code && (
                      <Badge variant="outline">Code: {college.counseling_code}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  {college.infrastructure_rating && (
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-accent font-bold text-2xl">
                        <Star className="h-6 w-6 fill-accent" />
                        {college.infrastructure_rating}/5
                      </div>
                      <p className="text-xs text-muted-foreground">Infrastructure</p>
                    </div>
                  )}
                  {college.placement_rating && (
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-primary font-bold text-2xl">
                        <Star className="h-6 w-6 fill-primary" />
                        {college.placement_rating}/5
                      </div>
                      <p className="text-xs text-muted-foreground">Placements</p>
                    </div>
                  )}
                </div>
              </div>
              
              {college.description && (
                <p className="text-muted-foreground leading-relaxed">{college.description}</p>
              )}
            </div>

            <Separator />

            {/* Departments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Departments Offered
                  </CardTitle>
                  {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingDept(null);
                      setDeptDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {departments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <Card key={dept.id} className="p-4 relative group">
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleEditDept(dept)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => setDeletingDeptId(dept.id)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <h4 className="font-semibold mb-2 pr-16">{dept.name}</h4>
                        {dept.hod_name && (
                          <p className="text-sm text-muted-foreground">HOD: {dept.hod_name}</p>
                        )}
                        {dept.intake_capacity && (
                          <p className="text-sm text-muted-foreground">
                            Intake: {dept.intake_capacity} students
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No departments added yet</p>
                    {isAdmin && (
                    <Button
                      onClick={() => {
                        setEditingDept(null);
                        setDeptDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Department
                    </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {college.established_year && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Established</p>
                      <p className="text-sm text-muted-foreground">{college.established_year}</p>
                    </div>
                  </div>
                )}
                
                {college.affiliation && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Affiliation</p>
                      <p className="text-sm text-muted-foreground">{college.affiliation}</p>
                    </div>
                  </div>
                )}
                
                {college.accreditation && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Accreditation</p>
                      <p className="text-sm text-muted-foreground">{college.accreditation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {college.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{college.address}</p>
                    </div>
                  </div>
                )}
                
                {college.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${college.phone}`} className="text-sm text-primary hover:underline">
                        {college.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {college.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${college.email}`} className="text-sm text-primary hover:underline">
                        {college.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {college.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a 
                        href={college.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit College Details</DialogTitle>
          </DialogHeader>
          <CollegeForm
            collegeId={id}
            initialData={college || undefined}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
          </DialogHeader>
          <DepartmentForm
            collegeId={id!}
            departmentId={editingDept?.id}
            initialData={editingDept || undefined}
            onSuccess={handleDeptSuccess}
            onCancel={() => {
              setDeptDialogOpen(false);
              setEditingDept(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingDeptId} onOpenChange={() => setDeletingDeptId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDeptId && handleDeleteDept(deletingDeptId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deletingCollege} onOpenChange={setDeletingCollege}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete College?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the college and may remove related departments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                try {
                  const { error } = await supabase.from('colleges').delete().eq('id', id);
                  if (error) throw error;
                  toast({ title: 'Deleted', description: 'College deleted successfully' });
                  navigate('/colleges', { replace: true });
                } catch (error: any) {
                  toast({ title: 'Error', description: error.message || 'Failed to delete college', variant: 'destructive' });
                } finally {
                  setDeletingCollege(false);
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