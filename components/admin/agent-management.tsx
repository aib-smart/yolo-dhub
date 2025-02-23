"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, CheckCircle, XCircle } from "lucide-react"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "pending" | "suspended"
  registrationDate: string
  lastActive: string
  transactions: number
}

const agents: Agent[] = [
  {
    id: "AGT001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+233 54 000 0001",
    status: "active",
    registrationDate: "2024-01-15",
    lastActive: "2025-02-19",
    transactions: 156,
  },
  {
    id: "AGT002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+233 54 000 0002",
    status: "pending",
    registrationDate: "2024-02-20",
    lastActive: "2025-02-19",
    transactions: 0,
  },
  {
    id: "AGT003",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+233 54 000 0003",
    status: "suspended",
    registrationDate: "2024-01-01",
    lastActive: "2024-02-15",
    transactions: 89,
  },
]

export function AgentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    suspended: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Agent Management</h2>
        <p className="text-muted-foreground">Manage and monitor agent accounts</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">143</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground" />
            <Input
              placeholder="Search agents..."
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
                <TableHead>Agent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.id}</TableCell>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{agent.email}</div>
                      <div className="text-sm text-muted-foreground">{agent.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{agent.registrationDate}</TableCell>
                  <TableCell>{agent.lastActive}</TableCell>
                  <TableCell>{agent.transactions}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors[agent.status]} text-white`}>
                      {agent.status}
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAgent(agent)
                            setIsDetailsOpen(true)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        {agent.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {agent.status === "active" && (
                          <DropdownMenuItem className="text-red-600">Suspend Account</DropdownMenuItem>
                        )}
                        {agent.status === "suspended" && (
                          <DropdownMenuItem className="text-green-600">Reactivate Account</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Agent Details</DialogTitle>
            <DialogDescription>Detailed information about the agent</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <p className="font-medium">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedAgent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-medium">{selectedAgent.phone}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Agent ID</label>
                    <p className="font-medium">{selectedAgent.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <Badge variant="secondary" className={`${statusColors[selectedAgent.status]} text-white ml-2`}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Registration Date</label>
                    <p className="font-medium">{selectedAgent.registrationDate}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

