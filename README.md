# DriveWise - Kosovo Driving Theory Exam Prep

A modern, multilingual web application for practicing driving theory exams in Kosovo. Built with Next.js, Supabase, and Tailwind CSS.

## 🚗 Features

- **6 License Categories**: Support for A (Motorcycles), B (Cars), C1/C (Trucks), CE (Trucks with Trailer), and D (Buses)
- **10 Mock Tests per Category**: Comprehensive practice tests designed to match real exams
- **Multilingual Support**: Available in Albanian (Shqip), Serbian (Српски), and English
- **Progress Tracking**: Monitor your improvement and review past test results
- **Modern UI**: Clean, responsive design with dark mode support
- **User Authentication**: Secure sign-up and login with Supabase
- **Real-time Scoring**: Instant feedback on test performance

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd drivewise
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings (Project Settings > API).

### 4. Set up the database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script

For detailed database setup instructions, see `database/README.md`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
drivewise/
├── app/                      # Next.js app directory
│   ├── (pages)/             # Route groups
│   │   └── (auth)/          # Authentication pages
│   ├── category/            # Category selection pages
│   ├── test/                # Test-taking interface
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   └── providers/           # Context providers
├── database/                # Database schema and docs
│   ├── schema.sql           # PostgreSQL schema
│   └── README.md            # Database setup guide
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── utils/                   # Supabase utilities
└── public/                  # Static assets
```

## 🗺️ Roadmap

The project follows a phased development approach:

### ✅ Milestone 1: Test Delivery System (Current)
- [x] Database schema and types
- [x] Category selection interface
- [x] Test-taking interface with 10 questions
- [x] Scoring and results display
- [x] Basic authentication

### 🔄 Milestone 2: User Progress Tracking (In Progress)
- [ ] User dashboard
- [ ] Test history and review
- [ ] Progress statistics
- [ ] Performance analytics

### 📝 Milestone 3: Explanations & Reference Materials
- [ ] Question explanations
- [ ] Practice mode with immediate feedback
- [ ] Road sign gallery
- [ ] Study materials and handbook

### 🔧 Milestone 4: Admin Panel
- [ ] Question management interface
- [ ] Test set configuration
- [ ] Content translation tools
- [ ] User management

### 📱 Milestone 5: PWA & Offline Mode
- [ ] Progressive Web App setup
- [ ] Offline question caching
- [ ] Service worker implementation
- [ ] Background sync

### 👨‍🏫 Milestone 6: Instructor Tools (Optional)
- [ ] Instructor accounts
- [ ] Student linking system
- [ ] Test assignment
- [ ] Results monitoring

## 🎨 Design Principles

- **Clean & Focused**: Minimal distractions, exam-centric features
- **Fast & Responsive**: Optimized for mobile devices
- **Accessible**: WCAG compliant, keyboard navigation
- **Multilingual**: Full support for Albanian, Serbian, and English

## 🔐 Security

- Row Level Security (RLS) policies in Supabase
- Secure authentication with Supabase Auth
- Environment variables for sensitive data
- HTTPS-only in production

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, please open an issue on GitHub.

---

**DriveWise** - Helping Kosovo learners pass their driving theory exam 🚗
