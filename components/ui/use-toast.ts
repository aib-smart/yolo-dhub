"use client"

import * as React from "react"

type ToastAction = {
  altText?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  type?: "default" | "destructive"
  className?: string
}

type ToasterProps = {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  className?: string
  children?: React.ReactNode
}

type ToastContextProps = {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (toastId: string) => void
  update: (toastId: string, props: Partial<ToastProps>) => void
}

const ToastContext = React.createContext<ToastContextProps>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  update: () => {},
})

function useToast() {
  return React.useContext(ToastContext)
}

export { ToastContext, useToast }

