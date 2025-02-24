"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { Wallet, Package, FileSpreadsheet, UserPlus, LogOut, User, ShoppingCart, Menu } from "lucide-react"

// Your sub-pages
import { InternetPackages } from "./internet-packages"
import { Wallet as WalletPage } from "./wallet"
import { AfaRegistration } from "./afa-registration"
import { RecentTransactions } from "./recent-transactions"
import { AgentProfile } from "./agent-profile"
import { Orders } from "./orders"

interface StatColorMap {
  [key: string]: string
}

export function ModernDataPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false) // toggles sidebar on mobile
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")

  // Check if user is logged in
  useEffect(() => {
    // Ensure localStorage is only accessed on the client side
    if (typeof window === "undefined") return;
  
    const userStr = localStorage.getItem("agent");
    if (!userStr) {
      router.push("/auth");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "agent") {
        router.push("/auth");
        return;
      }
      setUserName(user.name);
    } catch (error) {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push("/auth")
  }

  // Colors for stat cards
  const statColors: StatColorMap = {
    wallet: "bg-[#FFFFFF] bg-opacity-80 backdrop-blur-sm",
    sales: "bg-[#FFFFFF] bg-opacity-80 backdrop-blur-sm",
    deposited: "bg-[#FFFFFF] bg-opacity-80 backdrop-blur-sm",
    overdraft: "bg-[#FFFFFF] bg-opacity-80 backdrop-blur-sm",
  }

  // Stats data
  const statsData = {
    wallet: { value: "GHS 428.65", label: "Wallet Balance" },
    sales: { value: "GHS 3,941.39", label: "Total Sales" },
    deposited: { value: "GHS 3,951.00", label: "Total Deposited" },
    overdraft: { value: "-GHS ***", label: "Overdraft" },
  }

  // Inside the ModernDataPlatform component
  const renderMainContent = () => {
    // Ensure localStorage is only accessed on the client side
    if (typeof window === "undefined") {
      return null; // Return null or a loading state during SSR
    }
  
    const userStr = localStorage.getItem("agent");
    const user = userStr ? JSON.parse(userStr) : null;
    const uid = user?.uid; // Use uid instead of id
  
    switch (activeTab) {
      case "packages":
        return <InternetPackages />;
      case "wallet":
        return <WalletPage />;
      case "afa":
        return <AfaRegistration />;
      case "profile":
        return <AgentProfile />;
      case "orders":
        return <Orders agentId={uid} />; // Pass uid as agentId
      default:
        // Dashboard
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(statsData).map(([key, { value, label }]) => (
                <Card key={key} className={cn("shadow-md", statColors[key])}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-900">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-xl font-semibold ${key === "overdraft" ? "text-[#EE4443]" : "text-[#0FB982]"}`}>
                      {value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <RecentTransactions />
          </div>
        );
    }
  };

  // Reusable nav button
  const NavButton = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any
    label: string
    value: string
  }) => (
    <button
      onClick={() => {
        setActiveTab(value)
        setSidebarOpen(false) // close sidebar on mobile
      }}
      className={cn(
        "flex items-center space-x-2 w-full p-3 rounded-lg transition-colors",
        activeTab === value ? "bg-gray-900 text-white" : "hover:bg-gray-100",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow flex-shrink-0">
        <div className="mx-auto w-full max-w-screen-2xl px-4 flex justify-between items-center h-16">
          {/* Left: hamburger + brand */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 ml-4 lg:ml-16">YOLO DataHub</h1>
          </div>
          {/* Right: user info */}
          <div className="flex items-center space-x-4 mr-3 lg:mr-14">
            <button onClick={() => setActiveTab("profile")} className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium hidden sm:inline-block">{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        {/* Centered Container for sidebar + content */}
        <div className="mx-auto w-full max-w-screen-2xl relative flex">
          {/* Desktop Floating Sidebar */}
          <aside className="hidden lg:block w-64 pt-7 flex-shrink-0 relative">
            <div className="fixed w-4/4 px-4">
              <Card className="shadow-lg rounded-lg overflow-hidden">
                <CardContent className="flex flex-col py-4 h-full">
                  <nav className="flex-1 space-y-2 px-1">
                    <NavButton icon={Package} label="Dashboard" value="dashboard" />
                    <NavButton icon={FileSpreadsheet} label="Internet Packages" value="packages" />
                    <NavButton icon={Wallet} label="Wallet" value="wallet" />
                    <NavButton icon={ShoppingCart} label="Orders" value="orders" />
                    <NavButton icon={UserPlus} label="AFA Registration" value="afa" />
                  </nav>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 lg:pl-4">
            <div className="px-4 py-6 w-full max-w-5xl mx-auto">{renderMainContent()}</div>
          </main>

          {/* Mobile Sidebar (Overlay Drawer) */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Sidebar Drawer */}
              <div
                className="relative w-64 bg-white shadow-md"
                onClick={(e) => e.stopPropagation()} // prevent outside click from closing
              >
                <div className="p-4 space-y-2 overflow-y-auto h-full">
                  <NavButton icon={Package} label="Dashboard" value="dashboard" />
                  <NavButton icon={FileSpreadsheet} label="Internet Packages" value="packages" />
                  <NavButton icon={Wallet} label="Wallet" value="wallet" />
                  <NavButton icon={ShoppingCart} label="Orders" value="orders" />
                  <NavButton icon={UserPlus} label="AFA Registration" value="afa" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
              {/* Backdrop */}
              <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* Mobile Bottom Navigation */}
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
    </div>
  )
}

// Mobile Nav Button
function MobileNavButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: any
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-1 w-16 py-1 rounded-lg transition-colors",
        isActive ? "text-blue-600" : "text-gray-500",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

