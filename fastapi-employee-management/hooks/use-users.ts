"use client"

import { useState, useCallback } from "react"
import type { User, PaginatedResponse } from "@/types/api"

const API_BASE_URL = "https://fabtechsol-interview.onrender.com/api/v1"

interface UseUsersParams {
  page?: number
  size?: number
  search?: string
  role?: string
  is_active?: boolean
  order_by?: string
  order_desc?: boolean
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const fetchUsers = useCallback(async (params: UseUsersParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_BASE_URL}/users/?${searchParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PaginatedResponse = await response.json()
      setUsers(data.items as User[])
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

  const createUser = useCallback(async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create user")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
      return false
    }
  }, [])

  const updateUser = useCallback(async (id: number, userData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update user")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
      return false
    }
  }, [])

  const deleteUser = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to delete user")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
      return false
    }
  }, [])

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
