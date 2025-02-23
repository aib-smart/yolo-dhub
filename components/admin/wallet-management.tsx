"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface WalletTransaction {
  id: string
  agentId: string
  agentName: string
  amount: number
  type: "credit" | "debit"
  date: string
  status: "completed" | "pending" | "failed"
  balance: number
}

const transactions: WalletTransaction[] = [
  {
    id: "TXN001",
    agentId: "AGT001",
    agentName: "John Doe",
    amount: 1000.0,
    type: "credit",
    date: "2025-02-19",
    status: "completed",
    balance: 1500.0,
  },
  {
    id: "TXN002",
    agentId: "AGT002",
    agentName: "Jane Smith",
    amount: 500.0,
    type: "debit",
    date: "2025-02-19",
    status: "pending",
    balance: 750.0,
  },
]

export function WalletManagement() {
  const [isLoadDialog, setIsLoadDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleLoadWallet = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadDialog(false)
  }

  const filteredTransactions = transactions.filter((tx) =>
    searchTerm
      ? tx.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Wallet Management</h2>
          <p className="text-muted-foreground">Manage agent wallets and transactions</p>
        </div>
        <Dialog open={isLoadDialog} onOpenChange={setIsLoadDialog}>
          <DialogTrigger asChild>
            <Button>Load Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load Agent Wallet</DialogTitle>
              <DialogDescription>Enter the amount to load into the agent's wallet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLoadWallet} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="agentId">Agent ID</Label>
                <Input id="agentId" placeholder="Enter agent ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₵)</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Optional notes" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsLoadDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Load Wallet</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵45,231.89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground" />
            <Input
              placeholder="Search by Agent ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount (₵)</TableHead>
                <TableHead className="text-right">Balance (₵)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tx.agentName}</div>
                      <div className="text-sm text-muted-foreground">{tx.agentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.type === "credit" ? "default" : "secondary"}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tx.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {tx.type === "credit" ? "+" : "-"}₵{tx.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">₵{tx.balance.toFixed(2)}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`
                        ${tx.status === "completed" && "bg-green-500"}
                        ${tx.status === "pending" && "bg-yellow-500"}
                        ${tx.status === "failed" && "bg-red-500"}
                        text-white
                      `}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

