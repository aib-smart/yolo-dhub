"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const carriers = ["MTN", "AIRTELTIGO", "TELECEL"]

const packagesByCarrier = {
  MTN: [
    {
      name: "MTN Basic",
      data: "5GB",
      validity: "60 days",
      price: "GHS 50.00",
      popular: false,
    },
    {
      name: "MTN Standard",
      data: "15GB",
      validity: "60 days",
      price: "GHS 100.00",
      popular: true,
    },
    {
      name: "MTN Premium",
      data: "Unlimited",
      validity: "60 days",
      price: "GHS 200.00",
      popular: false,
    },
  ],
  AIRTELTIGO: [
    {
      name: "AirtelTigo Basic",
      data: "4GB",
      validity: "60 days",
      price: "GHS 45.00",
      popular: false,
    },
    {
      name: "AirtelTigo Standard",
      data: "10GB",
      validity: "60 days",
      price: "GHS 90.00",
      popular: true,
    },
    {
      name: "AirtelTigo Premium",
      data: "Unlimited",
      validity: "60 days",
      price: "GHS 180.00",
      popular: false,
    },
  ],
  TELECEL: [
    {
      name: "Telecel Basic",
      data: "3GB",
      validity: "30 days",
      price: "GHS 40.00",
      popular: false,
    },
    {
      name: "Telecel Standard",
      data: "8GB",
      validity: "30 days",
      price: "GHS 80.00",
      popular: false,
    },
    {
      name: "Telecel Premium",
      data: "Unlimited",
      validity: "30 days",
      price: "GHS 160.00",
      popular: true,
    },
  ],
}

export function InternetPackages() {
  const [selectedCarrier, setSelectedCarrier] = useState<string>("MTN")

  // Get packages based on selected carrier
  const packages = packagesByCarrier[selectedCarrier]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Internet Packages</h2>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      {/* Carrier Selection */}
      <div className="flex space-x-4">
        {carriers.map((carrier) => (
          <Button
            key={carrier}
            variant={carrier === selectedCarrier ? "default" : "outline"}
            onClick={() => setSelectedCarrier(carrier)}
          >
            {carrier}
          </Button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.name} className="relative">
            {pkg.popular && <Badge className="absolute -top-2 right-4">Most Popular</Badge>}
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{pkg.price}</span>
                <span className="text-muted-foreground">/ prepaid</span>
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
                <Button className="w-full">Purchase Package</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

