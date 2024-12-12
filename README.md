# SketchMyBiz - Business Assessment Platform

A comprehensive Next.js application for business assessment and analytics, featuring a modern UI built with Tailwind CSS and shadcn/ui components.

## Features

### 🏠 Landing Page
- Hero section with engaging visuals
- Benefits overview with animated cards
- Interactive product demo section
- Responsive navigation and footer

### 🔐 Authentication
- Email/password authentication
- Social login options (Google, Twitter, Facebook, GitHub)
- Secure session management
- User registration flow

### 📊 Assessment System
- Interactive questionnaire interface
- Confidence and knowledge tracking
- Progress monitoring
- Category-based questions

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

## Tech Stack

- **Framework**: Next.js 13.5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── about/           # About pages
│   ├── admin/           # Admin dashboard
│   ├── assessment/      # Assessment system
│   ├── auth/            # Authentication
│   ├── dashboard/       # User dashboard
│   └── onboarding/      # User onboarding
├── components/          # React components
│   ├── admin/          # Admin components
│   ├── assessment/     # Assessment components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── sections/      # Landing page sections
│   └── ui/            # Shared UI components
└── lib/                # Utility functions
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.