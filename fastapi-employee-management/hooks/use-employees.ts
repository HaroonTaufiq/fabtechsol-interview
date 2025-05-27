"use client"

import { useState, useCallback } from "react"
import type { Employee, PaginatedResponse } from "@/types/api"

const API_BASE_URL = "https://fabtechsol-interview.onrender.com/api/v1"

interface UseEmployeesParams {
  page?: number
  size?: number
  search?: string
  department?: string
  position?: string
  status?: string
  manager_id?: number
  order_by?: string
  order_desc?: boolean
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const fetchEmployees = useCallback(async (params: UseEmployeesParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_BASE_URL}/employees/?${searchParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PaginatedResponse = await response.json()
      setEmployees(data.items as Employee[])
      setPagination({
        total: data.total,
        page: data.page,
        size: data.size,
        pages: data.pages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const createEmployee = useCallback(async (employeeData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create employee")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee")
      return false
    }
  }, [])

  const updateEmployee = useCallback(async (id: number, employeeData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update employee")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update employee")
      return false
    }
  }, [])

  const deleteEmployee = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to delete employee")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete employee")
      return false
    }
  }, [])

  return {
    employees,
    loading,
    error,
    pagination,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
