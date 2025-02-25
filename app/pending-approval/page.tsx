import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Clock } from "lucide-react"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Clock className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <CardTitle className="text-2xl">Application Pending</CardTitle>
          <CardDescription>Your account is awaiting administrator approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for registering with YOLO DataHub. Your application is currently under review. You will receive an
            email notification once your account has been approved.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="mailto:support@yolodatahub.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/auth">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

