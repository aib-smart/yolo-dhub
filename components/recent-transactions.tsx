"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DatePickerWithRange } from "./ui/date-range-picker"
import { Search, Filter, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

// Transaction interface
interface Transaction {
  id: string
  agentId: string
  agentName: string
  customerName: string
  customerPhone: string
  product: string
  amount: number
  date: string
  status: "completed" | "pending" | "cancelled" | "review"
  paymentMethod: string
  notes: string
  createdAt: string
  narration: string
}

// Fetch function with error handling
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error("API Fetch Error:", error)
    throw error
  }
}

// Component
export function RecentTransactions() {
  const [visibleCount, setVisibleCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [agentId, setAgentId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAgentId(sessionStorage.getItem("agentId"))
    }
  }, [])

  const { data: transactions = [], error } = useSWR(
    agentId ? `/api/orders?agentId=${agentId}` : null,
    fetcher
  )

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus

      const matchesDate =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(transaction.date).getTime() >= dateRange.from.getTime() &&
          new Date(transaction.date).getTime() <= dateRange.to.getTime())

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [transactions, searchTerm, selectedStatus, dateRange])

  if (error) {
    return <p className="text-red-500">Error fetching transactions</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, product, or payment method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount (GHS)</TableHead>
                  <TableHead>Narration</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.slice(0, visibleCount).map((transaction: Transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), "EEE, MMM d, yyyy")}</TableCell>
                    <TableCell>{transaction.agentName}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell className="text-right font-medium">{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.narration}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={`bg-${transaction.status === "completed" ? "emerald" : transaction.status === "pending" ? "yellow" : "red"}-500 text-white`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
