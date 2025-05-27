"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Building, Activity } from "lucide-react"
import Link from "next/link"
import { ApiStatus } from "@/components/api-status"
import { StatsCards } from "@/components/stats-cards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Employee Management System</h1>
          <p className="text-xl text-gray-600 mb-6">
            Manage users and employees with a modern FastAPI backend and Next.js frontend
          </p>
          <ApiStatus />
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription>Create, view, edit, and manage user accounts with role-based access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CRUD Operations</Badge>
                  <Badge variant="secondary">Role Management</Badge>
                  <Badge variant="secondary">Search & Filter</Badge>
                </div>
                <Link href="/users">
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-600" />
                Employee Management
              </CardTitle>
              <CardDescription>Manage employee records, departments, positions, and hierarchies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Employee Records</Badge>
                  <Badge variant="secondary">Department Tracking</Badge>
                  <Badge variant="secondary">Manager Hierarchy</Badge>
                </div>
                <Link href="/employees">
                  <Button className="w-full">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Employees
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              API Documentation & Testing
            </CardTitle>
            <CardDescription>Access interactive API documentation and test endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="https://fabtechsol-interview.onrender.com/docs" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full">
                  Swagger UI
                </Button>
              </a>
              <a href="https://fabtechsol-interview.onrender.com/redoc" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full">
                  ReDoc
                </Button>
              </a>
              <a href="https://fabtechsol-interview.onrender.com/health" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full">
                  Health Check
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
