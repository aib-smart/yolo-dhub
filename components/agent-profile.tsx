import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"

const agentData = {
  personalInfo: {
    name: "Iyke Agent",
    email: "iyke@example.com",
    phone: "+233 54 000 0000",
    address: "123 Main Street, Accra",
    joinDate: "August 15, 2023",
    agentId: "AGT001234",
  },
  performance: {
    totalTransactions: 1567,
    successRate: "98.5%",
    averageResponse: "2.3 mins",
    monthlyRating: "4.8/5",
  },
  documents: [
    { name: "ID Card", status: "Verified", date: "2023-08-15" },
    { name: "Business License", status: "Verified", date: "2023-08-15" },
    { name: "Tax Certificate", status: "Pending", date: "2024-02-20" },
  ],
}

export function AgentProfile() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Agent Profile</h2>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">{agentData.personalInfo.name}</h3>
                <p className="text-sm text-muted-foreground">Agent ID: {agentData.personalInfo.agentId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{agentData.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{agentData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{agentData.personalInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {agentData.personalInfo.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{agentData.performance.totalTransactions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{agentData.performance.successRate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="text-2xl font-bold">{agentData.performance.averageResponse}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Rating</p>
              <p className="text-2xl font-bold">{agentData.performance.monthlyRating}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Verification Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {agentData.documents.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">Updated {doc.date}</p>
                  </div>
                </div>
                <Badge variant={doc.status === "Verified" ? "default" : "secondary"}>{doc.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

