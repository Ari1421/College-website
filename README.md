# CollegePedia - Tamil Nadu College Information Portal

A comprehensive web application for exploring colleges across Tamil Nadu with district-based filtering, detailed college information, and admin management capabilities.

## Features

- 🎓 Browse 20+ districts across Tamil Nadu
- 🏛️ View detailed information about colleges (Engineering, Medical, Arts, Law, Management)
- 📊 Dashboard with top colleges and statistics
- 👤 User authentication (Admin & End Users)
- ⚙️ Admin panel for CRUD operations on colleges and departments
- 📱 Fully responsive design
- 🔒 Secure backend with Row Level Security

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd collegepedia
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

### For End Users:

1. Visit the homepage
2. Select a district from the dropdown to view colleges
3. Click on any college card to view detailed information
4. Explore the Dashboard for top colleges and statistics

### For Admins:

1. Sign in with admin credentials
2. Access the Admin panel from the navigation
3. Perform CRUD operations on colleges and departments

## Database Schema

### Tables:
- `districts` - 20 Tamil Nadu districts
- `colleges` - College information with ratings and details
- `departments` - Departments within each college
- `profiles` - User profile information
- `user_roles` - Admin/User role management

### Sample Data:
The database comes pre-populated with:
- 20 Tamil Nadu districts
- 12 sample colleges across 4 districts
- Multiple departments per college

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── Header.tsx   # Navigation header
│   └── Footer.tsx   # Footer component
├── hooks/           # Custom React hooks
│   └── useAuth.tsx  # Authentication hook
├── pages/           # Application pages
│   ├── Home.tsx     # Landing page with district selector
│   ├── Auth.tsx     # Login/Signup page
│   ├── Colleges.tsx # All colleges listing
│   ├── CollegeDetails.tsx # Individual college details
│   └── Dashboard.tsx # Statistics and top colleges
└── integrations/    # Backend integrations
    └── supabase/    # Supabase client and types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

All environment variables are automatically managed by Lovable Cloud. No manual configuration needed.

## Deployment

The application is configured for deployment on Lovable Cloud. Simply click "Publish" in the Lovable interface.

## Adding Your Own Data

To replace sample data with actual college information:

1. Sign in as admin
2. Navigate to the Admin panel
3. Use the CRUD interface to:
   - Add new colleges
   - Update existing information
   - Add departments
   - Manage college details

Or use SQL queries directly in the Lovable Cloud interface.

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access for data modifications
- Secure authentication with Supabase Auth
- Email auto-confirmation enabled for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is created with Lovable and is available for educational purposes.

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using Lovable