"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import { type Order, subscribeToOrders, markOrdersAsExported } from "@/lib/services/orders"
import { initializeNotifications, setupNotificationListener } from "@/lib/services/notifications"

const statusColors = {
  completed: "bg-emerald-500",
  pending: "bg-yellow-500",
  cancelled: "bg-gray-500",
  failed: "bg-red-500",
  review: "bg-blue-500",
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
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const [ordersData, setOrdersData] = useState<Order[]>([])

  useEffect(() => {
    let unsubscribe: () => void

    const initializeComponent = async () => {
      try {
        // Initialize notifications
        if (typeof window !== "undefined") {
          await initializeNotifications("admin") // Pass admin ID
          setupNotificationListener()
        }

        // Subscribe to orders
        unsubscribe = subscribeToOrders((orders) => {
          setOrdersData(orders)

          // Check for new orders and show toast
          const newOrders = orders.filter((order) => order.status === "review")
          if (newOrders.length > 0) {
            toast({
              title: "New Orders Received",
              description: `You have ${newOrders.length} new order(s) to review`,
            })
          }
        })
      } catch (error) {
        console.error("Error initializing component:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders. Please refresh the page.",
        })
      }
    }

    initializeComponent()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [toast])

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const exportToExcel = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to export",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Get selected orders data
      const ordersToExport = ordersData
        .filter((order) => selectedOrders.includes(order.id))
        .map((order) => ({
          "Order ID": order.id,
          "Agent ID": order.agentId,
          "Agent Name": order.agentName,
          "Customer Phone": order.customerPhone,
          Product: order.product,
          Amount: `₵${order.amount.toFixed(2)}`,
          Date: order.date,
          Status: order.status.toUpperCase(),
          "Payment Method": order.paymentMethod || "",
          Notes: order.notes || "",
        }))

      // Create the worksheet
      const ws = XLSX.utils.json_to_sheet(ordersToExport)

      // Add column widths
      ws["!cols"] = [
        { wch: 10 }, // Order ID
        { wch: 10 }, // Agent ID
        { wch: 20 }, // Agent Name
        { wch: 15 }, // Customer Phone
        { wch: 20 }, // Product
        { wch: 10 }, // Amount
        { wch: 12 }, // Date
        { wch: 10 }, // Status
        { wch: 15 }, // Payment Method
        { wch: 30 }, // Notes
      ]

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Orders")

      // Generate blob
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbout], { type: "application/octet-stream" })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `orders_export_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update orders in Firestore
      await markOrdersAsExported(selectedOrders)

      setSelectedOrders([])

      toast({
        title: "Export Successful",
        description: `${selectedOrders.length} orders have been exported and marked as pending`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting orders",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
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
        <Button onClick={exportToExcel} disabled={isExporting || selectedOrders.length === 0}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </>
          )}
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
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
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
                  <TableRow
                    key={order.id}
                    className={cn(order.exported && "bg-muted/50", selectedOrders.includes(order.id) && "bg-muted")}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.id}
                      {order.exported && (
                        <Badge variant="outline" className="ml-2">
                          Exported
                        </Badge>
                      )}
                    </TableCell>
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
                              event.status === "review" && "bg-blue-500",
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

