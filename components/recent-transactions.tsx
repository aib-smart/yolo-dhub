import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"

interface Transaction {
  id: string
  timestamp: Date
  transactionType: string
  number: string
  amount: number
  narration: string
  status: "completed" | "pending" | "failed"
}

const recentTransactions: Transaction[] = [
  {
    id: "1",
    timestamp: new Date("2024-02-21T10:30:00"),
    transactionType: "Data Bundle Purchase",
    number: "0241234567",
    amount: 50.0,
    narration: "5GB Data Bundle Purchase",
    status: "completed",
  },
  {
    id: "2",
    timestamp: new Date("2024-02-21T09:15:00"),
    transactionType: "Wallet Top-up",
    number: "0201234567",
    amount: 200.0,
    narration: "Agent Wallet Funding",
    status: "completed",
  },
  {
    id: "3",
    timestamp: new Date("2024-02-21T08:45:00"),
    transactionType: "AFA Registration",
    number: "0551234567",
    amount: 10.0,
    narration: "New AFA Registration Fee",
    status: "pending",
  },
  {
    id: "4",
    timestamp: new Date("2024-02-21T08:30:00"),
    transactionType: "Data Bundle Purchase",
    number: "0271234567",
    amount: 100.0,
    narration: "10GB Data Bundle Purchase",
    status: "failed",
  },
]

const statusColors = {
  completed: "bg-emerald-500",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
}

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <Badge variant="outline" className="font-normal">
          Today
        </Badge>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Number</TableHead>
                <TableHead className="text-right">Amount (₵)</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
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
      </Card>
    </div>
  )
}

