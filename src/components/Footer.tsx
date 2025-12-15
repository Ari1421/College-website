import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CollegePedia
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your comprehensive guide to finding the perfect college in Tamil Nadu. 
              Discover top institutions across all districts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="text-muted-foreground hover:text-primary transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* College Types */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">College Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/colleges?type=engineering" className="text-muted-foreground hover:text-primary transition-colors">
                  Engineering Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=medical" className="text-muted-foreground hover:text-primary transition-colors">
                  Medical Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=arts" className="text-muted-foreground hover:text-primary transition-colors">
                  Arts & Science Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=law" className="text-muted-foreground hover:text-primary transition-colors">
                  Law Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=management" className="text-muted-foreground hover:text-primary transition-colors">
                  Management Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@collegepedia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CollegePedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}