"use client"

import type React from "react"
import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Package, Wallet, Users, Settings, LogOut, LayoutDashboard, ShieldCheck, ShoppingCart } from "lucide-react"
import { logoutUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { SidebarProvider } from "@/components/ui/sidebar"
import { LoadingSkeleton } from "@/components/ui/loading"

interface AdminLayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
      isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
    } ${className}`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
)

function AdminLayoutContent({ children, activeTab, setActiveTab }: AdminLayoutProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams, setActiveTab])

  useEffect(() => {
    // Check if user is logged in and is admin
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "admin") {
        router.push("/auth")
      }
    } catch (error) {
      router.push("/auth")
    }
  }, [router])

  const handleLogout = () => {
    logoutUser()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push("/auth")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                YOLO DataHub Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
              <span className="text-sm font-medium hidden sm:inline-block">Admin Panel</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </nav>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Admin Sidebar */}
          <Sidebar className="hidden lg:block border-r">
            <SidebarContent className="py-4 h-full flex flex-col">
              <nav className="space-y-2 flex-1">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isActive={activeTab === "admin-dashboard"}
                  onClick={() => setActiveTab("admin-dashboard")}
                />
                <SidebarItem
                  icon={Package}
                  label="Data Packages"
                  isActive={activeTab === "packages"}
                  onClick={() => setActiveTab("packages")}
                />
                <SidebarItem
                  icon={Wallet}
                  label="Wallet Management"
                  isActive={activeTab === "wallets"}
                  onClick={() => setActiveTab("wallets")}
                />
                <SidebarItem
                  icon={Users}
                  label="Agent Management"
                  isActive={activeTab === "agents"}
                  onClick={() => setActiveTab("agents")}
                />
                <SidebarItem
                  icon={ShoppingCart}
                  label="Orders"
                  isActive={activeTab === "orders"}
                  onClick={() => setActiveTab("orders")}
                />
                <SidebarItem
                  icon={ShieldCheck}
                  label="Verifications"
                  isActive={activeTab === "verifications"}
                  onClick={() => setActiveTab("verifications")}
                />
              </nav>

              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 mt-auto"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <div className="px-4 py-6 lg:px-8 w-full max-w-7xl mx-auto">{children}</div>
          </main>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 lg:hidden">
            <div className="flex justify-around p-2">
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === "admin-dashboard" ? "text-primary" : "text-muted-foreground"}
                onClick={() => setActiveTab("admin-dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === "packages" ? "text-primary" : "text-muted-foreground"}
                onClick={() => setActiveTab("packages")}
              >
                <Package className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === "orders" ? "text-primary" : "text-muted-foreground"}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={activeTab === "agents" ? "text-primary" : "text-muted-foreground"}
                onClick={() => setActiveTab("agents")}
              >
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Main component with Suspense using the skeleton fallback
export function AdminLayout({ children, activeTab, setActiveTab }: AdminLayoutProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminLayoutContent children={children} activeTab={activeTab} setActiveTab={setActiveTab} />
    </Suspense>
  )
}

