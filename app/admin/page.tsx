"use client"

import { useState } from "react"

import { Suspense } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { PackageManagement } from "@/components/admin/package-management"
import { WalletManagement } from "@/components/admin/wallet-management"
import { AgentManagement } from "@/components/admin/agent-management"
import { OrdersManagement } from "@/components/admin/orders-management"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminContent />
    </Suspense>
  )
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState("admin-dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "admin-dashboard":
        return <AdminDashboard />
      case "packages":
        return <PackageManagement />
      case "wallets":
        return <WalletManagement />
      case "agents":
        return <AgentManagement />
      case "orders":
        return <OrdersManagement />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  )
}

