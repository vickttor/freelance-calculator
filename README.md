# Freelance Calculator

### Note: This entire application was built by [Claude 3.7](http://claude.ai/) Sonnet and [Cursor IDE](https://www.cursor.com/) in under 1 hour for experimental purposes.

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/Prisma-latest-blue" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-14-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-latest-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</div>

<p align="center">
  <img src="./.github/assets//thumb.png" alt="Freelance Calculator Banner" width="800" />
</p>

## 📋 Overview

Freelance Calculator is a comprehensive SaaS application designed to help freelancers calculate project pricing based on their working schedule and hourly rates. It simplifies project management and pricing for freelancers, enabling them to make informed financial decisions.

## ✨ Features

- **Project Management**

  - Create and manage all your freelance projects in one place
  - Track project timelines, scope, and pricing

- **Accurate Pricing**

  - Calculate project costs based on working days, hours, and rates
  - Visualize project timelines and profitability

- **Payment Discounts**

  - Offer configurable discounts for preferred payment methods
  - Set up PIX payment discounts (customizable)

- **Client Management**

  - Store client contact information
  - Maintain client project history

- **Authentication**
  - Secure login with email/password, Google, or Microsoft accounts
  - Protected routes and session management

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, ShadcnUI
- **Backend**: Next.js API Routes (Full-stack application)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Containerization**: Docker for development environment

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Setup

1. Clone the repository:

```bash
git clone https://github.com/vickttor/freelance-calculator.git
cd freelance-calculator
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freelance_calculator?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-nextauth-secret-here"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
```

5. Start the development environment:

```bash
npm run dev
```

This will:

- Start the PostgreSQL database in Docker
- Push the schema to the database
- Start the Next.js development server

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧰 Development Scripts

```bash
# Start development environment
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linters
npm run lint

# Format code with Prettier
npm run lint:prettier:fix

# Start database services
npm run services:up

# Stop database services
npm run services:down

# Update database schema
npm run prisma:push

# Generate Prisma client
npm run prisma:generate
```

## 📊 Project Structure

```
freelance-calculator/
├── app/                  # Next.js application routes
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Dashboard and application pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── projects/         # Project-related components
│   └── ui/               # UI components from ShadcnUI
├── lib/                  # Utility functions and libraries
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── infra/                # Infrastructure config (Docker)
```

## 🌐 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Manual deployment

For production deployment with Neon or Supabase:

1. Update the `DATABASE_URL` in your environment variables
2. Configure proper authentication for OAuth providers
3. Deploy using your preferred platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadcnUI](https://ui.shadcn.com/)
- [Docker](https://www.docker.com/)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/vickttor">Victor H. Silva</a></p>
</div>
