"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Users, Package, Wallet, AlertTriangle, Settings } from "lucide-react"

export function AdminDashboard() {
  const router = useRouter()

  const stats = [
    {
      title: "Total Revenue",
      value: "₵45,231.89",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Active Agents",
      value: "143",
      change: "+3.2%",
      trend: "up",
    },
    {
      title: "Total Transactions",
      value: "1,234",
      change: "-2.4%",
      trend: "down",
    },
    {
      title: "Average Transaction",
      value: "₵36.65",
      change: "+5.7%",
      trend: "up",
    },
  ]

  const alerts = [
    {
      type: "warning",
      message: "5 new agent verifications pending",
      time: "10 minutes ago",
    },
    {
      type: "error",
      message: "Failed transaction rate above threshold",
      time: "1 hour ago",
    },
    {
      type: "info",
      message: "System maintenance scheduled",
      time: "2 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of system performance and metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{stat.value}</div>
                <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="flex items-center">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.type === "warning"
                        ? "text-yellow-500"
                        : alert.type === "error"
                          ? "text-red-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/admin?tab=agents")}
              >
                <Users className="h-6 w-6" />
                <span>Manage Agents</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/admin?tab=packages")}
              >
                <Package className="h-6 w-6" />
                <span>Data Packages</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/admin?tab=wallets")}
              >
                <Wallet className="h-6 w-6" />
                <span>Load Wallet</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
                onClick={() => router.push("/admin/settings")}
              >
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

