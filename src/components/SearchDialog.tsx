import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';

interface College {
  id: string;
  name: string;
  college_type: string;
  address: string | null;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open) {
      fetchColleges();
    }
  }, [open]);

  const fetchColleges = async () => {
    const { data } = await supabase
      .from('colleges')
      .select('id, name, college_type, address')
      .order('name');
    if (data) setColleges(data);
  };

  const handleSelect = (collegeId: string) => {
    setOpen(false);
    navigate(`/college/${collegeId}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full md:w-64"
      >
        <Search className="h-4 w-4" />
        <span>Search colleges...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search colleges..." />
        <CommandList>
          <CommandEmpty>No colleges found.</CommandEmpty>
          <CommandGroup heading="Colleges">
            {colleges.map((college) => (
              <CommandItem
                key={college.id}
                value={college.name}
                onSelect={() => handleSelect(college.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{college.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {college.college_type} • {college.address}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
