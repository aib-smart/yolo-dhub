"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  agentId: string
  agentName: string
  customerPhone: string
  product: string
  amount: number
  date: string
  status: "completed" | "pending" | "cancelled" | "failed"
  paymentMethod?: string
  notes?: string
  timeline?: {
    status: string
    timestamp: string
    description: string
  }[]
}

const orders: Order[] = [
  {
    id: "ORD001",
    agentId: "AGT001",
    agentName: "John Doe",
    customerPhone: "+233 54 123 4567",
    product: "5GB Data Bundle",
    amount: 50.0,
    date: "2024-02-21",
    status: "completed",
    paymentMethod: "Wallet Balance",
    notes: "Customer requested immediate activation",
    timeline: [
      {
        status: "created",
        timestamp: "2024-02-21 10:30:00",
        description: "Order created by agent",
      },
      {
        status: "payment_confirmed",
        timestamp: "2024-02-21 10:30:05",
        description: "Payment confirmed from wallet balance",
      },
      {
        status: "processing",
        timestamp: "2024-02-21 10:30:10",
        description: "Processing data bundle activation",
      },
      {
        status: "completed",
        timestamp: "2024-02-21 10:30:15",
        description: "Data bundle activated successfully",
      },
    ],
  },
  {
    id: "ORD002",
    agentId: "AGT002",
    agentName: "Jane Smith",
    customerPhone: "+233 55 123 4567",
    product: "10GB Data Bundle",
    amount: 100.0,
    date: "2024-02-21",
    status: "pending",
    paymentMethod: "Mobile Money",
    notes: "Customer wants the bundle activated by evening",
    timeline: [
      {
        status: "created",
        timestamp: "2024-02-21 09:00:00",
        description: "Order created by agent",
      },
      {
        status: "payment_pending",
        timestamp: "2024-02-21 09:05:00",
        description: "Payment pending from Mobile Money",
      },
    ],
  },
  {
    id: "ORD003",
    agentId: "AGT001",
    agentName: "John Doe",
    customerPhone: "+233 24 123 4567",
    product: "15GB Data Bundle",
    amount: 150.0,
    date: "2024-02-20",
    status: "failed",
    paymentMethod: "Wallet Balance",
    notes: "Insufficient balance in customer's wallet",
    timeline: [
      {
        status: "created",
        timestamp: "2024-02-20 14:20:00",
        description: "Order created by agent",
      },
      {
        status: "payment_failed",
        timestamp: "2024-02-20 14:20:05",
        description: "Payment failed due to insufficient balance",
      },
    ],
  },
  {
    id: "ORD004",
    agentId: "AGT003",
    agentName: "Bob Wilson",
    customerPhone: "+233 20 123 4567",
    product: "Unlimited Data Bundle",
    amount: 200.0,
    date: "2024-02-20",
    status: "cancelled",
    paymentMethod: "Bank Transfer",
    notes: "Customer cancelled order due to long processing time",
    timeline: [
      {
        status: "created",
        timestamp: "2024-02-20 16:00:00",
        description: "Order created by agent",
      },
      {
        status: "payment_pending",
        timestamp: "2024-02-20 16:05:00",
        description: "Payment pending from Bank Transfer",
      },
      {
        status: "cancelled",
        timestamp: "2024-02-20 16:10:00",
        description: "Order cancelled by customer",
      },
    ],
  },
]

const statusColors = {
  completed: "bg-emerald-500",
  pending: "bg-yellow-500",
  cancelled: "bg-gray-500",
  failed: "bg-red-500",
}

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    // Implement CSV export functionality
    console.log("Exporting orders...")
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Orders Management</h2>
          <p className="text-muted-foreground">View and manage all orders in the system</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="lg:col-span-2">
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Amount (₵)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.agentName}</div>
                        <div className="text-sm text-muted-foreground">{order.agentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="text-right">{order.amount.toFixed(2)}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusColors[order.status]} text-white`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>View Details</DropdownMenuItem>
                          {order.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-emerald-600">Mark as Completed</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                            </>
                          )}
                          {order.status === "failed" && <DropdownMenuItem>Retry Order</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Detailed information about the order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Order ID</label>
                      <p className="font-medium">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Product</label>
                      <p className="font-medium">{selectedOrder.product}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Amount</label>
                      <p className="font-medium">₵{selectedOrder.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Payment Method</label>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <Badge variant="secondary" className={`${statusColors[selectedOrder.status]} text-white ml-2`}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer & Agent Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Customer Phone</label>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Agent Name</label>
                      <p className="font-medium">{selectedOrder.agentName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Agent ID</label>
                      <p className="font-medium">{selectedOrder.agentId}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Notes</label>
                      <p className="font-medium">{selectedOrder.notes || "No notes available"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gray-200">
                    {selectedOrder.timeline?.map((event, index) => (
                      <div key={index} className="relative flex items-start">
                        <div className="absolute left-0 flex h-10 w-10 items-center justify-center">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              event.status === "completed" && "bg-emerald-500",
                              event.status === "processing" && "bg-blue-500",
                              event.status === "created" && "bg-gray-500",
                            )}
                          />
                        </div>
                        <div className="ml-12 space-y-1">
                          <div className="text-sm font-medium">{event.description}</div>
                          <div className="text-xs text-muted-foreground">{event.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedOrder.status === "pending" && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                  <Button variant="destructive">Cancel Order</Button>
                  <Button>Mark as Completed</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

