"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  defaultCollapsed?: boolean
  children: React.ReactNode
}

export function Sidebar({ defaultCollapsed = false, children, className, ...props }: SidebarProps) {
  const { collapsed, mobileOpen } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "border-r bg-white transition-all duration-300 ease-in-out hidden lg:block",
          collapsed ? "w-16" : "w-64",
          className,
        )}
        {...props}
      >
        {children}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => useSidebar().setMobileOpen(false)}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-white border-r z-50 lg:hidden transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </aside>
    </>
  )
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  const handleClick = () => {
    if (window.innerWidth >= 1024) {
      setCollapsed(!collapsed)
    } else {
      setMobileOpen(!mobileOpen)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500",
        className,
      )}
      {...props}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  const { collapsed } = useSidebar()

  return (
    <div className={cn("flex flex-col overflow-x-hidden", collapsed && "items-center", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType
  label: string
  isActive?: boolean
}

export function SidebarItem({ icon: Icon, label, isActive, className, ...props }: SidebarItemProps) {
  const { collapsed } = useSidebar()

  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100",
        isActive && "bg-gray-100 text-gray-900",
        collapsed ? "justify-center" : "w-full",
        className,
      )}
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

