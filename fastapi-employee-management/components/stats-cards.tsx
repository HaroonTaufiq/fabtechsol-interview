"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, UserCheck, Activity } from "lucide-react"

interface Stats {
  totalUsers: number
  totalEmployees: number
  activeUsers: number
  departments: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEmployees: 0,
    activeUsers: 0,
    departments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users stats
        const usersResponse = await fetch("https://fabtechsol-interview.onrender.com/api/v1/users/?page=1&size=1")
        const usersData = await usersResponse.json()

        // Fetch employees stats
        const employeesResponse = await fetch("https://fabtechsol-interview.onrender.com/api/v1/employees/?page=1&size=1")
        const employeesData = await employeesResponse.json()

        // Fetch active users
        const activeUsersResponse = await fetch("https://fabtechsol-interview.onrender.com/api/v1/users/?page=1&size=1&is_active=true")
        const activeUsersData = await activeUsersResponse.json()

        setStats({
          totalUsers: usersData.total || 0,
          totalEmployees: employeesData.total || 0,
          activeUsers: activeUsersData.total || 0,
          departments: 5, // This would need a separate endpoint
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-purple-600",
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: Activity,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
