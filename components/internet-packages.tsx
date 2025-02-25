"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Package = Database["public"]["Tables"]["packages"]["Row"]

const carriers = ["MTN", "AIRTELTIGO", "TELECEL"]

export function InternetPackages() {
  const [selectedCarrier, setSelectedCarrier] = useState<string>("MTN")
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [senderName, setSenderName] = useState("")
  const [amountPaid, setAmountPaid] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const { toast } = useToast()

  // Fetch packages when carrier changes
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("carrier", selectedCarrier.toLowerCase())
          .eq("active", true)
          .order("price", { ascending: true })

        if (error) throw error

        setPackages(data)
      } catch (err) {
        console.error("Error fetching packages:", err)
        setError("Failed to load packages")
        toast({
          title: "Error",
          description: "Failed to load packages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [selectedCarrier, toast])

  // Handle package purchase button click
  const handlePurchaseClick = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsPaymentModalOpen(true)
  }

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!selectedPackage) return

    // Validate amount paid
    const paidAmount = Number.parseFloat(amountPaid)
    if (paidAmount !== selectedPackage.price) {
      toast({
        title: "Error",
        description: `Amount paid (GHS ${paidAmount}) does not match package price (GHS ${selectedPackage.price}).`,
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!transactionId || !senderName || !amountPaid || !selectedNetwork) {
      toast({
        title: "Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get the logged-in agent's details
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not logged in")
      }

      // Get agent profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (!profile) {
        throw new Error("Agent profile not found")
      }

      // Create order
      const { data: order, error } = await supabase
        .from("orders")
        .insert([
          {
            agent_id: user.id,
            agent_name: `${profile.first_name} ${profile.last_name}`,
            customer_phone: "", // Add field to form if needed
            product: `${selectedPackage.carrier.toUpperCase()} - ${selectedPackage.name}`,
            amount: selectedPackage.price,
            payment_method: "Mobile Money",
            payment_network: selectedNetwork,
            transaction_id: transactionId,
            sender_name: senderName,
            status: "review",
            notes: `Package: ${selectedPackage.name}, Data: ${selectedPackage.data}, Validity: ${selectedPackage.validity}`,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Show success message
      toast({
        title: "Order Submitted",
        description: `Your order for ${selectedPackage.name} has been submitted for review.`,
      })

      // Reset form and close modal
      setTransactionId("")
      setSenderName("")
      setAmountPaid("")
      setSelectedNetwork("")
      setIsPaymentModalOpen(false)
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit order",
        variant: "destructive",
      })
    }
  }

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
        {isLoading ? (
          <div className="col-span-full text-center">Loading packages...</div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : packages.length === 0 ? (
          <div className="col-span-full text-center">No packages available for {selectedCarrier}</div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.id} className="relative">
              {pkg.popular && <Badge className="absolute -top-2 right-4">Most Popular</Badge>}
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">GHS {pkg.price.toFixed(2)}</span>
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
                  <Button className="w-full" onClick={() => handlePurchaseClick(pkg)}>
                    Purchase Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Please pay to one of the numbers below and provide the transaction details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Selected Package Info */}
            {selectedPackage && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="font-medium">{selectedPackage.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPackage.data} | {selectedPackage.validity}
                </div>
                <div className="text-lg font-bold">GHS {selectedPackage.price.toFixed(2)}</div>
              </div>
            )}

            {/* Network Selection */}
            <div className="space-y-2">
              <Label>Payment Network</Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MTN">MTN (0550061197) - Isaac Antwi Benoah</SelectItem>
                  <SelectItem value="Telecel">Telecel (0207526118) - Isaac Antwi Benoah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Sender Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender's name"
              />
            </div>
            <div className="space-y-2">
              <Label>Amount Paid</Label>
              <Input
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                type="number"
                step="0.01"
                placeholder="Enter amount paid"
              />
            </div>
            <Button className="w-full" onClick={handlePaymentSubmit}>
              Submit Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

