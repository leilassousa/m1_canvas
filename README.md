# SketchMyBiz - Business Assessment Platform

A comprehensive Next.js application for business assessment and analytics, featuring a modern UI built with Tailwind CSS and shadcn/ui components. The platform leverages Supabase for backend services and integrates AI-powered insights using Anthropic's Claude model.

## Features

### 🏠 Landing Page
- Hero section with engaging visuals
- Benefits overview with animated cards
- Interactive product demo section
- Responsive navigation and footer

### 🔐 Authentication
- Email/password authentication via Supabase Auth
- Social login options (Google, Twitter, Facebook, GitHub)
- Secure session management
- User registration flow

### 📊 Assessment System
- Interactive questionnaire interface
- Confidence and knowledge tracking for each question
- Progress monitoring
- Category-based questions with detailed analytics

### 📱 Dashboard
- Personal reports overview
- System updates tracking
- Featured applications
- Support ticket system

### 👥 User Management
- Profile management
- Account settings
- Support contact form
- Activity tracking

### 🛠 Admin Panel
- Category management
- Question management
- User analytics
- System metrics

### 🧠 AI-Powered Insights
- Business canvas analysis using Anthropic Claude AI
- Strengths and weaknesses identification
- Actionable recommendations based on assessment data
- Confidence and knowledge score analysis

### 💳 Payment Integration
- Stripe payment processing
- Subscription management
- Tiered pricing plans

## Tech Stack

- **Framework**: Next.js 13.5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Anthropic Claude API
- **Payments**: Stripe

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── about/           # About pages
│   ├── admin/           # Admin dashboard
│   ├── assessment/      # Assessment system
│   ├── auth/            # Authentication
│   ├── dashboard/       # User dashboard
│   ├── onboarding/      # User onboarding
│   ├── reports/         # Report viewing
│   ├── portfolio/       # User portfolio
│   ├── pricing/         # Pricing plans
│   ├── faq/             # FAQ pages
│   ├── test-ai/         # AI testing interface
│   └── api/             # API routes
├── components/          # React components
│   ├── admin/          # Admin components
│   ├── assessment/     # Assessment components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── sections/      # Landing page sections
│   └── ui/            # Shared UI components
├── lib/                # Utility functions
│   └── agents/        # AI agent implementations
├── supabase/           # Supabase configuration
│   └── migrations/    # Database migrations
└── types/              # TypeScript type definitions
```

## Database Schema

The application uses a PostgreSQL database managed by Supabase with the following key tables:

- **auth.users**: Handles authentication (managed by Supabase)
- **profiles**: User profile information
- **categories**: Assessment categories
- **questions**: Assessment questions
- **assessments**: User assessment sessions
- **answers**: User responses to questions
- **reports**: Generated assessment reports
- **purchases**: User subscription and payment records

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables:
     - Supabase URL and API key
     - Anthropic API key
     - Stripe API keys

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Integration

The platform uses Anthropic's Claude model to analyze business assessment data and provide insights:

- **Strengths Analysis**: Identifies business strengths based on high confidence and knowledge scores
- **Weakness Detection**: Pinpoints areas for improvement based on lower scores
- **Actionable Recommendations**: Provides specific, actionable steps for business improvement
- **Confidence Analysis**: Evaluates user confidence levels across different business areas
- **Knowledge Analysis**: Assesses user knowledge gaps and suggests learning opportunities

## Development Guidelines

### Component Structure
- Keep components small and focused
- Use TypeScript for type safety
- Follow the shadcn/ui component patterns
- Implement responsive designs

### State Management
- Use React hooks for local state
- Implement context where needed
- Keep state close to where it's used

### Styling
- Use Tailwind CSS utilities
- Follow the design system colors
- Maintain consistent spacing
- Ensure responsive layouts

### Database Access
- Use Supabase client for database operations
- Implement proper RLS (Row Level Security) policies
- Keep sensitive operations in API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.