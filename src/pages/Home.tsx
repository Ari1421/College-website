import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, MapPin, Star, TrendingUp, Users, Building2, Award } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-college.jpg';
import featureStudy from '@/assets/feature-study.jpg';
import featureInfrastructure from '@/assets/feature-infrastructure.jpg';
import featurePlacement from '@/assets/feature-placement.jpg';

type District = {
  id: string;
  name: string;
};

type College = {
  id: string;
  name: string;
  college_type: string;
  district_id: string;
  image_url: string | null;
  infrastructure_rating: number | null;
  placement_rating: number | null;
  address: string | null;
};

export default function Home() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [topColleges, setTopColleges] = useState<College[]>([]);
  const [stats, setStats] = useState({ totalColleges: 0, totalDistricts: 0, totalDepartments: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
    fetchTopColleges();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchCollegesByDistrict(selectedDistrict);
    } else {
      setColleges([]);
    }
  }, [selectedDistrict]);

  const fetchDistricts = async () => {
    const { data } = await supabase
      .from('districts')
      .select('*')
      .order('name');
    if (data) setDistricts(data);
  };

  const fetchCollegesByDistrict = async (districtId: string) => {
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .eq('district_id', districtId)
      .order('name');
    if (data) setColleges(data);
  };

  const fetchTopColleges = async () => {
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .or('infrastructure_rating.gte.4,placement_rating.gte.4')
      .limit(6);
    if (data) setTopColleges(data);
  };

  const fetchStats = async () => {
    const [collegesRes, districtsRes, deptRes] = await Promise.all([
      supabase.from('colleges').select('id', { count: 'exact', head: true }),
      supabase.from('districts').select('id', { count: 'exact', head: true }),
      supabase.from('departments').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalColleges: collegesRes.count || 0,
      totalDistricts: districtsRes.count || 0,
      totalDepartments: deptRes.count || 0,
    });
  };

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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="College Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Find Your Future at the Perfect College
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive information on Tamil Nadu's top institutions, compare facilities, 
              and make informed decisions for your educational journey.
            </p>
            
            {/* District Selector */}
            <Card className="max-w-2xl mx-auto mt-8 border-muted shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Find colleges in your district</span>
                  </div>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select your district..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="p-8 space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <p className="text-4xl font-bold text-foreground">{stats.totalColleges}</p>
                <p className="text-sm text-muted-foreground font-medium">Colleges Listed</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="p-8 space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
                <p className="text-4xl font-bold text-foreground">{stats.totalDistricts}</p>
                <p className="text-sm text-muted-foreground font-medium">Districts Covered</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardContent className="p-8 space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <p className="text-4xl font-bold text-foreground">{stats.totalDepartments}</p>
                <p className="text-sm text-muted-foreground font-medium">Academic Programs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to make the right decision for your educational future
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-muted hover:shadow-lg transition-shadow group">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={featureStudy} 
                  alt="Quality Education" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Quality Education</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Access detailed information about academic programs, faculty expertise, and student success rates across institutions.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-muted hover:shadow-lg transition-shadow group">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={featureInfrastructure} 
                  alt="Modern Infrastructure" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Modern Infrastructure</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Explore state-of-the-art facilities, laboratories, libraries, and campus amenities with comprehensive ratings.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-muted hover:shadow-lg transition-shadow group">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={featurePlacement} 
                  alt="Career Opportunities" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Career Opportunities</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Review placement records, industry partnerships, and career development support to plan your professional journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Selected District Colleges - Grouped by Type */}
      {colleges.length > 0 && (
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Colleges in {districts.find(d => d.id === selectedDistrict)?.name}
            </h2>
            
            {/* Group colleges by type */}
            {['engineering', 'medical', 'arts', 'law', 'dental', 'pharmacy', 'agriculture', 'veterinary', 'polytechnic', 'management', 'education'].map((type) => {
              const typeColleges = colleges.filter(c => c.college_type === type);
              if (typeColleges.length === 0) return null;
              
              return (
                <div key={type} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className={getCollegeTypeColor(type)} variant="secondary">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Colleges
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {typeColleges.length} college{typeColleges.length !== 1 ? 's' : ''} found
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(`/colleges/${type}`)}
                      className="ml-auto"
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeColleges.map((college) => (
                      <Card 
                        key={college.id} 
                        className="overflow-hidden border-muted hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                        onClick={() => navigate(`/college/${college.id}`)}
                      >
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                            alt={college.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-5 space-y-3">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{college.name}</h3>
                          </div>
                          {college.address && (
                            <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                              {college.address}
                            </p>
                          )}
                          {college.infrastructure_rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-medium text-foreground">{college.infrastructure_rating}</span>
                              <span className="text-muted-foreground">/5</span>
                            </div>
                          )}
                          <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Top Colleges Carousel */}
      <section className="bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Top Rated Institutions</h2>
            <p className="text-muted-foreground">Explore the highest-rated colleges based on infrastructure and placements</p>
          </div>
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-4">
              {topColleges.map((college) => (
                <CarouselItem key={college.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="overflow-hidden border-muted hover:shadow-xl transition-all duration-300 cursor-pointer h-full group" 
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{college.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {college.college_type.charAt(0).toUpperCase() + college.college_type.slice(1)}
                      </Badge>
                      {(college.infrastructure_rating || college.placement_rating) && (
                        <div className="flex gap-4 text-sm">
                          {college.infrastructure_rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-medium text-foreground">{college.infrastructure_rating}</span>
                              <span className="text-muted-foreground text-xs">/5</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 hidden md:flex" />
            <CarouselNext className="-right-12 hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <Footer />
    </div>
  );
}