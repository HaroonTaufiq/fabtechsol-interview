export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "manager" | "employee" | "user"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  employee_id: string
  user_id: number
  department: string
  position: string
  salary?: number
  hire_date: string
  status: "active" | "inactive" | "terminated" | "on_leave"
  manager_id?: number
  phone?: string
  address?: string
  created_at: string
  updated_at: string
  user: User
}

export interface PaginatedResponse {
  items: any[]
  total: number
  page: number
  size: number
  pages: number
}
