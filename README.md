# Barangay Almanza Dos - Document Management System

A modern web application for managing barangay document applications and services in Las Piñas City, Metro Manila.

## 🌟 Features

### For Residents
- **User Registration & Authentication** - Secure account creation and login
- **Document Applications** - Apply for various barangay documents online
- **Application Tracking** - Real-time status updates with tracking numbers
- **Dashboard** - Personal overview of applications and account status
- **Document Download** - Download completed documents digitally

### For Administrators
- **Admin Panel** - Comprehensive management dashboard
- **Application Processing** - Review, approve, or reject applications
- **User Management** - Manage resident accounts and permissions
- **Reports & Analytics** - Generate reports and view system statistics
- **Document Type Management** - Configure available documents and requirements

## 📋 Available Documents

1. **Barangay Clearance** (₱50) - Certificate of good standing
2. **Certificate of Indigency** (Free) - For low-income families
3. **Business Permit** (₱500) - Permit to operate business
4. **Certificate of Residency** (₱30) - Proof of residence
5. **Barangay ID** (₱100) - Official barangay identification

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context + Local Storage
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🎨 Design System

The application uses a Philippine government-inspired color scheme with:
- **Primary Colors**: Blues and greens representing civic trust
- **Typography**: Clear, accessible fonts for government services
- **Components**: Consistent UI patterns following shadcn/ui design principles
- **Responsive Design**: Mobile-first approach for accessibility

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form-specific components
│   └── dashboard/      # Dashboard-specific components
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   ├── Dashboard.tsx   # User dashboard
│   ├── Applications.tsx # Application management
│   └── Admin.tsx       # Admin panel
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication logic
├── lib/                # Utility libraries
│   └── validations.ts  # Zod validation schemas
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── utils/              # Helper functions
│   ├── constants.ts    # Application constants
│   └── helpers.ts      # Utility functions
└── main.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barangay-document-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Accounts

For testing purposes, the application includes mock authentication:

- **Regular User**: Any email/password combination
- **Admin User**: Use email containing "admin" (e.g., admin@example.com)

## 🔐 Authentication & Security

Currently implements frontend-only authentication with localStorage for demo purposes. For production deployment:

- Integrate with Supabase for backend authentication
- Implement proper JWT token validation
- Add password hashing and security measures
- Set up role-based access control (RBAC)

## 📱 Features Roadmap

### Phase 1 (Current)
- ✅ User registration and authentication
- ✅ Document application forms
- ✅ Application tracking system
- ✅ Admin panel for processing
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Backend integration with Supabase
- [ ] File upload for document attachments
- [ ] Email notifications for status updates
- [ ] Digital document generation (PDF)
- [ ] Payment integration for fees

### Phase 3 (Future)
- [ ] Mobile app development
- [ ] Digital signatures
- [ ] Appointment scheduling
- [ ] SMS notifications
- [ ] Advanced reporting and analytics

## 🏗 Backend Integration

This application is designed to integrate with Supabase for production use:

### Database Schema
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  contact_number TEXT,
  address TEXT,
  role TEXT DEFAULT 'resident',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Document types table
document_types (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  requirements TEXT[],
  fee DECIMAL,
  processing_time TEXT,
  is_active BOOLEAN DEFAULT true
)

-- Applications table
applications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  document_type_id UUID REFERENCES document_types(id),
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  processed_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  tracking_number TEXT UNIQUE
)
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- **Vercel**: Automatic deployment from Git
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting for public repositories

## 📄 License

This project is intended for educational and demonstration purposes. For production use in actual government services, ensure compliance with local regulations and data privacy laws.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or support regarding this document management system:

- **Barangay Office**: Monday to Friday, 8:00 AM - 5:00 PM
- **Contact**: +63 2 8872-1234
- **Email**: almanzados@laspinas.gov.ph

---

**Barangay Almanza Dos** - Serving the community with modern, efficient digital services.