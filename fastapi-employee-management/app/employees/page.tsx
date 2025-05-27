"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Search, Filter, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EmployeeForm } from "@/components/employee-form"
import { DeleteDialog } from "@/components/delete-dialog"
import { Pagination } from "@/components/pagination"
import { useEmployees } from "@/hooks/use-employees"
import type { Employee } from "@/types/api"

export default function EmployeesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null)
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // Updated default value
  const [page, setPage] = useState(1)

  const {
    employees,
    loading,
    error,
    pagination,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee: removeEmployee,
  } = useEmployees()

  useEffect(() => {
    fetchEmployees({
      page,
      size: 10,
      search: search || undefined,
      department: departmentFilter || undefined,
      status: statusFilter === "all" ? undefined : statusFilter, // Updated condition
    })
  }, [page, search, departmentFilter, statusFilter, fetchEmployees])

  const handleCreateEmployee = async (employeeData: any) => {
    const success = await createEmployee(employeeData)
    if (success) {
      setShowForm(false)
      fetchEmployees({ page, size: 10 })
    }
  }

  const handleUpdateEmployee = async (employeeData: any) => {
    if (editingEmployee) {
      const success = await updateEmployee(editingEmployee.id, employeeData)
      if (success) {
        setEditingEmployee(null)
        fetchEmployees({ page, size: 10 })
      }
    }
  }

  const handleDeleteEmployee = async () => {
    if (deleteEmployee) {
      const success = await removeEmployee(deleteEmployee.id)
      if (success) {
        setDeleteEmployee(null)
        fetchEmployees({ page, size: 10 })
      }
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary / 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600">Manage employee records and information</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Building className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                placeholder="Filter by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setDepartmentFilter("")
                  setStatusFilter("all") // Updated default value
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>Employees ({pagination?.total || 0})</CardTitle>
            <CardDescription>
              Showing {employees.length} of {pagination?.total || 0} employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading employees...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
                <Button onClick={() => fetchEmployees({ page, size: 10 })} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No employees found</p>
                <Button onClick={() => setShowForm(true)} className="mt-2">
                  Create First Employee
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {employee.user.first_name} {employee.user.last_name}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800">{employee.employee_id}</Badge>
                          <Badge className={getStatusBadgeColor(employee.status)}>
                            {employee.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                          <div className="space-y-1">
                            <p>
                              <strong>Department:</strong> {employee.department}
                            </p>
                            <p>
                              <strong>Position:</strong> {employee.position}
                            </p>
                            <p>
                              <strong>Email:</strong> {employee.user.email}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p>
                              <strong>Salary:</strong>{" "}
                              {employee.salary ? formatSalary(employee.salary) : "Not specified"}
                            </p>
                            <p>
                              <strong>Hire Date:</strong> {new Date(employee.hire_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Phone:</strong> {employee.phone || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingEmployee(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteEmployee(employee)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="mt-6">
                <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Form Modal */}
        {(showForm || editingEmployee) && (
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
            onCancel={() => {
              setShowForm(false)
              setEditingEmployee(null)
            }}
          />
        )}

        {/* Delete Confirmation */}
        {deleteEmployee && (
          <DeleteDialog
            title="Delete Employee"
            description={`Are you sure you want to delete employee ${deleteEmployee.employee_id} (${deleteEmployee.user.first_name} ${deleteEmployee.user.last_name})? This action cannot be undone.`}
            onConfirm={handleDeleteEmployee}
            onCancel={() => setDeleteEmployee(null)}
          />
        )}
      </div>
    </div>
  )
}
