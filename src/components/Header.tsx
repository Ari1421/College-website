import { GraduationCap, Menu, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SearchDialog } from '@/components/SearchDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/hooks/useSession';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isAuthenticated, isAdmin, user, signOut } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BestCollegeAdvisor
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium hover:text-primary">
                  Browse by Type
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/colleges/engineering" className="cursor-pointer">Engineering</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/medical" className="cursor-pointer">Medical</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/arts" className="cursor-pointer">Arts & Science</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/law" className="cursor-pointer">Law</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/dental" className="cursor-pointer">Dental</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/pharmacy" className="cursor-pointer">Pharmacy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/agriculture" className="cursor-pointer">Agriculture</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/veterinary" className="cursor-pointer">Veterinary</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/polytechnic" className="cursor-pointer">Polytechnic</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/management" className="cursor-pointer">Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colleges/education" className="cursor-pointer">Education</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/colleges" className="text-sm font-medium hover:text-primary transition-colors">
              All Colleges
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>
          <div className="hidden md:block flex-1">
            <SearchDialog />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <span className="text-sm">
                    {user?.user_metadata?.full_name || user?.email || 'Account'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}