import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const packages = [
  {
    name: "Basic",
    data: "5GB",
    validity: "30 days",
    price: "¢50.00",
    features: ["4G LTE", "No Speed Cap", "24/7 Support"],
    popular: false,
  },
  {
    name: "Standard",
    data: "15GB",
    validity: "30 days",
    price: "¢100.00",
    features: ["4G LTE", "No Speed Cap", "24/7 Support", "Roll Over Data"],
    popular: true,
  },
  {
    name: "Premium",
    data: "Unlimited",
    validity: "30 days",
    price: "¢200.00",
    features: ["5G Ready", "No Speed Cap", "24/7 Priority Support", "Roll Over Data", "Multi-device"],
    popular: false,
  },
]

export function InternetPackages() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Internet Packages</h2>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.name} className="relative">
            {pkg.popular && <Badge className="absolute -top-2 right-4">Most Popular</Badge>}
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{pkg.price}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium">{pkg.data}</div>
                  <div className="text-sm text-muted-foreground">Data Allowance</div>
                </div>
                <div>
                  <div className="font-medium">{pkg.validity}</div>
                  <div className="text-sm text-muted-foreground">Validity</div>
                </div>
                <ul className="space-y-2 text-sm">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Purchase Package</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

