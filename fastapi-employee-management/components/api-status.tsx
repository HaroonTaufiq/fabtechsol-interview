"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ApiHealth {
  status: string
  database: string
  environment: string
}

export function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://fabtechsol-interview.onrender.com/health")
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      } else {
        setError("API is not responding")
      }
    } catch (err) {
      setError("Cannot connect to API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">API Status:</span>
        {loading ? (
          <Badge variant="secondary">Checking...</Badge>
        ) : error ? (
          <Badge variant="destructive">Offline</Badge>
        ) : health?.status === "healthy" ? (
          <Badge className="bg-green-100 text-green-800">Online</Badge>
        ) : (
          <Badge variant="destructive">Unhealthy</Badge>
        )}
      </div>

      {health && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Database:</span>
          <Badge variant={health.database === "connected" ? "default" : "destructive"}>{health.database}</Badge>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={checkHealth} disabled={loading}>
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
