import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  {
    id: "1",
    date: "2025-02-19",
    type: "Credit",
    amount: "GHS 500.00",
    status: "Completed",
    balance: "GHS 1,500.00",
  },
  {
    id: "2",
    date: "2024-02-20",
    type: "Debit",
    amount: "-GHS 200.00",
    status: "Completed",
    balance: "GHS 1,000.00",
  },
  // Add more transactions as needed
]

export function Wallet() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Wallet</h2>
        <p className="text-muted-foreground">Manage your funds and transactions</p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">GHS 1,500.00</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">156</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">GHS 0.00</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add-funds" className="w-full">
        <TabsList>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="add-funds" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" placeholder="Enter amount" />
                </div>
                <Button className="w-full">Add Funds</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.status}</TableCell>
                      <TableCell>{tx.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

