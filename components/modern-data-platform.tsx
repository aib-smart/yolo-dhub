"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Package, FileSpreadsheet, UserPlus, LogOut, User, ShoppingCart } from "lucide-react"
import { InternetPackages } from "./internet-packages"
import { Wallet as WalletPage } from "./wallet"
import { AfaRegistration } from "./afa-registration"
import { RecentTransactions } from "./recent-transactions"
import { AgentProfile } from "./agent-profile"
import { Orders } from "./orders"
import { Button } from "./ui/button"
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"
import { logoutUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function ModernDataPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "agent") {
        router.push("/auth")
        return
      }
      setUserName(user.name)
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

  const statsData = {
    wallet: { value: "¢9.61", label: "Wallet Balance" },
    sales: { value: "¢3,941.39", label: "Total Sales" },
    deposited: { value: "¢3,951.00", label: "Total Deposited" },
    overdraft: { value: "-¢200.00", label: "Overdraft" },
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "packages":
        return <InternetPackages />
      case "wallet":
        return <WalletPage />
      case "afa":
        return <AfaRegistration />
      case "profile":
        return <AgentProfile />
      case "orders":
        return <Orders />
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(statsData).map(([key, { value, label }]) => (
                <Card key={key} className="backdrop-blur-sm bg-white/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-2xl font-semibold ${
                        value.includes("-") ? "text-destructive" : "text-emerald-600"
                      }`}
                    >
                      {value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <RecentTransactions />
          </div>
        )
    }
  }

  const NavButton = ({ icon: Icon, label, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
        activeTab === value ? "bg-gray-900 text-white" : "hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AIB.Smart DataHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setActiveTab("profile")} className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium hidden sm:inline-block">{userName}</span>
            </div>
          </div>
        </nav>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <Sidebar defaultCollapsed={false} className="hidden lg:block border-r">
            <SidebarContent className="py-4 h-full flex flex-col">
              <nav className="space-y-2 flex-1 px-4">
                <NavButton icon={Package} label="Dashboard" value="dashboard" />
                <NavButton icon={FileSpreadsheet} label="Internet Packages" value="packages" />
                <NavButton icon={Wallet} label="Wallet" value="wallet" />
                <NavButton icon={ShoppingCart} label="Orders" value="orders" />
                <NavButton icon={UserPlus} label="AFA Registration" value="afa" />
              </nav>

              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto",
              // Mobile styles
              "lg:px-6 lg:py-6", // Desktop padding
              "pb-24 lg:pb-6", // Account for mobile navigation
            )}
          >
            <div
              className={cn(
                "mx-auto",
                // Mobile styles
                "px-4 py-4",
                // Desktop styles
                "lg:max-w-6xl lg:px-0",
                // Container styles
                "w-full",
              )}
            >
              {renderMainContent()}
            </div>
          </main>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 lg:hidden">
            <div className="flex justify-around p-2 items-center h-16 px-4 mx-auto max-w-md">
              <MobileNavButton
                icon={Package}
                label="Home"
                isActive={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <MobileNavButton
                icon={FileSpreadsheet}
                label="Packages"
                isActive={activeTab === "packages"}
                onClick={() => setActiveTab("packages")}
              />
              <MobileNavButton
                icon={Wallet}
                label="Wallet"
                isActive={activeTab === "wallet"}
                onClick={() => setActiveTab("wallet")}
              />
              <MobileNavButton
                icon={ShoppingCart}
                label="Orders"
                isActive={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

// New Mobile Navigation Button Component
function MobileNavButton({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-1 w-16 py-1 rounded-lg transition-colors",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

