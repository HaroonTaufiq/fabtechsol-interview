# Employee Management Frontend

A modern Next.js frontend for the Employee Management System FastAPI backend.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS and shadcn/ui components
- **Full CRUD Operations** for Users and Employees
- **Real-time API Status** monitoring
- **Advanced Filtering & Search** capabilities
- **Responsive Design** for all screen sizes
- **Form Validation** with proper error handling
- **Pagination** for large datasets
- **Modal Forms** for creating and editing records

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Lucide React** - Modern icon library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- FastAPI backend running on `http://localhost:8000`

## 🚀 Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### Home Page (`/`)
- API status monitoring
- Quick stats overview
- Navigation to Users and Employees
- Links to API documentation

### Users Page (`/users`)
- View all users with pagination
- Search by name, email, username
- Filter by role and status
- Create, edit, and delete users
- Real-time form validation

### Employees Page (`/employees`)
- View all employees with user details
- Search by employee ID, department, position
- Filter by department and status
- Create, edit, and delete employees
- Salary formatting and date handling

## 🔧 Configuration

The frontend is configured to connect to the FastAPI backend at:
\`\`\`
http://localhost:8000
\`\`\`

To change this, update the `API_BASE_URL` in:
- `hooks/use-users.ts`
- `hooks/use-employees.ts`
- `components/api-status.tsx`
- `components/stats-cards.tsx`

## 🎨 UI Components

The app uses shadcn/ui components including:
- **Cards** - For content containers
- **Buttons** - Various styles and states
- **Forms** - Input, Select, Textarea, Switch
- **Badges** - Status and role indicators
- **Dialogs** - Modal forms and confirmations
- **Pagination** - Navigate through data

## 📊 API Integration

### Custom Hooks
- `useUsers()` - Manages user CRUD operations
- `useEmployees()` - Manages employee CRUD operations

### Features
- Automatic error handling
- Loading states
- Optimistic updates
- Type-safe API calls

## 🔍 Search & Filtering

### Users
- **Search**: Username, email, first name, last name
- **Filters**: Role (admin, manager, employee, user), Active status
- **Sorting**: By any field, ascending/descending

### Employees
- **Search**: Employee ID, department, position
- **Filters**: Department, status (active, inactive, terminated, on leave)
- **Sorting**: By any field, ascending/descending

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Adaptive layouts for tablets and desktops
- Touch-friendly interface elements
- Optimized forms for mobile input

## 🚀 Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 🐳 Docker Support

Create a `Dockerfile` for containerization:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
\`\`\`
