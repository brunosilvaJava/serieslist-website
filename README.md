# Series List Website

A full-stack Next.js application for managing and sharing series lists. Built with modern web technologies including Next.js App Router, PostgreSQL, Prisma, Next-Auth, and Zod.

## Features

- 🔐 **User Authentication** - Secure registration and login with Next-Auth
- 📝 **CRUD Operations** - Create, read, update, and delete lists and series
- 🔗 **Public Share Links** - Share your lists publicly with unique shareable links
- 👤 **User Dashboard** - Personal dashboard to manage all your lists
- 🗃️ **PostgreSQL Database** - Reliable data persistence with Prisma ORM
- ✅ **Data Validation** - Input validation using Zod schemas
- 🎨 **Modern UI** - Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: Prisma
- **Authentication**: Next-Auth
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Containerization**: Docker Compose

## Database Schema

### Models

**User**
- `id` (PK) - Unique identifier
- `email` (UNIQUE) - User email
- `password` - Hashed password
- `name` - Optional user name
- `createdAt`, `updatedAt` - Timestamps

**List**
- `id` (PK) - Unique identifier
- `name` - List name
- `isPublic` - Public visibility flag
- `shareId` (UNIQUE) - Unique share identifier
- `userId` (FK) - Owner reference
- `createdAt`, `updatedAt` - Timestamps
- Relationship: 1:N with Serie (CASCADE delete)

**Serie**
- `id` (PK) - Unique identifier
- `title` - Serie title
- `description` - Optional description
- `listId` (FK) - List reference
- `createdAt`, `updatedAt` - Timestamps
- Relationship: N:1 with List (CASCADE delete)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd serieslist-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update if needed:
```env
DATABASE_URL="postgresql://serieslist:serieslist@localhost:5432/serieslist"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Start PostgreSQL database**
```bash
docker compose up -d
```

5. **Run Prisma migrations**
```bash
npx prisma migrate dev
```

6. **Generate Prisma Client**
```bash
npx prisma generate
```

7. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
serieslist-website/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── lists/           # List CRUD endpoints
│   │   └── series/          # Serie CRUD endpoints
│   ├── auth/                # Auth pages (signin, register)
│   ├── dashboard/           # Dashboard and list management
│   └── share/               # Public share pages
├── components/              # React components
├── lib/                     # Utility functions
│   ├── auth.ts             # Next-Auth configuration
│   ├── prisma.ts           # Prisma client
│   └── validations.ts      # Zod schemas
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration files
├── types/                   # TypeScript type definitions
└── docker-compose.yml       # Docker configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in (via Next-Auth)
- `POST /api/auth/signout` - Sign out (via Next-Auth)

### Lists
- `GET /api/lists` - Get all user's lists
- `POST /api/lists` - Create new list
- `GET /api/lists/[id]` - Get list by ID with series
- `PUT /api/lists/[id]` - Update list
- `DELETE /api/lists/[id]` - Delete list (CASCADE deletes series)

### Series
- `POST /api/series` - Create new serie
- `PUT /api/series/[id]` - Update serie
- `DELETE /api/series/[id]` - Delete serie

## Usage

### Creating an Account
1. Navigate to the home page
2. Click "Register"
3. Fill in your email, password, and optional name
4. Click "Register" to create your account

### Managing Lists
1. Sign in to your account
2. Click "Create New List" on the dashboard
3. Enter a list name and choose visibility (public/private)
4. Click "Create" to save

### Adding Series
1. Click "View Details" on a list
2. Click "+ Add Serie"
3. Enter the serie title and optional description
4. Click "Add" to save

### Sharing Lists
1. Make sure your list is set to "Public"
2. Click "Copy Share Link" on the list card
3. Share the link with others - they can view without signing in

## Database Management

### View database with Prisma Studio
```bash
npx prisma studio
```

### Reset database
```bash
npx prisma migrate reset
```

### Create new migration
```bash
npx prisma migrate dev --name your_migration_name
```

## Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Route protection with Next-Auth
- Input validation with Zod
- CSRF protection (Next-Auth)
- Secure HTTP-only cookies

## License

This project is open source and available under the MIT License.
