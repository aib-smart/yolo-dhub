"use client"

import { useState } from "react"
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

// Transaction interface remains the same
interface Transaction {
  id: string
  timestamp: Date
  transactionType: string
  number: string
  amount: number
  narration: string
  status: "completed" | "pending" | "failed"
}

// Example data (you can add more transactions if needed)
const recentTransactions: Transaction[] = [
  {
    id: "1",
    timestamp: new Date("2025-02-19T10:30:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0241234567",
    amount: 50.0,
    narration: "5GB Data Bundle Purchase",
    status: "completed",
  },
  {
    id: "2",
    timestamp: new Date("2025-02-19T09:15:00Z"),
    transactionType: "Wallet Top-up",
    number: "0201234567",
    amount: 200.0,
    narration: "Agent Wallet Funding",
    status: "completed",
  },
  {
    id: "3",
    timestamp: new Date("2025-02-19T08:45:00Z"),
    transactionType: "AFA Registration",
    number: "0551234567",
    amount: 10.0,
    narration: "New AFA Registration Fee",
    status: "pending",
  },
  {
    id: "4",
    timestamp: new Date("2025-02-19T08:30:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0271234567",
    amount: 100.0,
    narration: "10GB Data Bundle Purchase",
    status: "failed",
  },
  // Add more transactions here for testing (IDs 5 through 12, for example)
  {
    id: "5",
    timestamp: new Date("2025-02-18T12:00:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0241111111",
    amount: 50.0,
    narration: "5GB Data Bundle Purchase",
    status: "completed",
  },
  {
    id: "6",
    timestamp: new Date("2025-02-18T11:45:00Z"),
    transactionType: "Wallet Top-up",
    number: "0202222222",
    amount: 150.0,
    narration: "Agent Wallet Funding",
    status: "completed",
  },
  {
    id: "7",
    timestamp: new Date("2025-02-18T11:30:00Z"),
    transactionType: "AFA Registration",
    number: "0553333333",
    amount: 10.0,
    narration: "New AFA Registration Fee",
    status: "pending",
  },
  {
    id: "8",
    timestamp: new Date("2025-02-18T11:15:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0274444444",
    amount: 75.0,
    narration: "7.5GB Data Bundle Purchase",
    status: "completed",
  },
  {
    id: "9",
    timestamp: new Date("2025-02-18T10:45:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0275555555",
    amount: 50.0,
    narration: "5GB Data Bundle Purchase",
    status: "failed",
  },
  {
    id: "10",
    timestamp: new Date("2025-02-18T10:30:00Z"),
    transactionType: "Wallet Top-up",
    number: "0206666666",
    amount: 200.0,
    narration: "Agent Wallet Funding",
    status: "completed",
  },
  {
    id: "11",
    timestamp: new Date("2025-02-18T10:15:00Z"),
    transactionType: "AFA Registration",
    number: "0557777777",
    amount: 10.0,
    narration: "New AFA Registration Fee",
    status: "pending",
  },
  {
    id: "12",
    timestamp: new Date("2025-02-18T10:00:00Z"),
    transactionType: "Data Bundle Purchase",
    number: "0278888888",
    amount: 100.0,
    narration: "10GB Data Bundle Purchase",
    status: "completed",
  },
]

const statusColors = {
  completed: "bg-emerald-500",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
}

const transactionTypes = Array.from(new Set(recentTransactions.map((tx) => tx.transactionType)))

export function RecentTransactions() {
  const [visibleCount, setVisibleCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // Filter transactions based on search term and filters
  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.narration.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || transaction.transactionType === selectedType
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus

    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (transaction.timestamp >= dateRange.from && transaction.timestamp <= dateRange.to)

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  // Slice transactions based on visibleCount
  const transactionsToDisplay = filteredTransactions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTransactions.length

  // Reset filters
  const resetFilters = () => {
    setSelectedType("all")
    setSelectedStatus("all")
    setDateRange({ from: undefined, to: undefined })
  }

  // If there are no transactions, display a simple skeleton placeholder
  if (recentTransactions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <Card className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <Badge variant="outline" className="font-normal">
          Today
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                {showFilters && (
                  <Button variant="outline" size="icon" onClick={resetFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead className="text-right">Amount (GHS)</TableHead>
                  <TableHead>Narration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsToDisplay.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(transaction.timestamp, "EEE, MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>{transaction.number}</TableCell>
                    <TableCell className="text-right font-medium">{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.narration}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusColors[transaction.status]} text-white`}>
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

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount(visibleCount + 10)}>
            See More
          </Button>
        </div>
      )}
    </div>
  )
}

