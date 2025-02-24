"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const carriers = ["MTN", "AIRTELTIGO", "TELECEL"];

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
};

export function InternetPackages() {
  const [selectedCarrier, setSelectedCarrier] = useState<string>("MTN");
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    data: string;
    validity: string;
    price: string;
  } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const { toast } = useToast();

  // Get packages based on selected carrier
  const packages = packagesByCarrier[selectedCarrier];

  // Handle package purchase button click
  const handlePurchaseClick = (pkg: {
    name: string;
    data: string;
    validity: string;
    price: string;
  }) => {
    setSelectedPackage(pkg);
    setIsPaymentModalOpen(true);
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!selectedPackage) return;
  
    // Validate amount paid
    const packagePrice = parseFloat(selectedPackage.price.replace("GHS ", ""));
    const paidAmount = parseFloat(amountPaid);
    if (paidAmount !== packagePrice) {
      toast({
        title: "Error",
        description: `Amount paid (GHS ${paidAmount}) does not match package price (GHS ${packagePrice}).`,
        variant: "destructive",
      });
      return;
    }
  
    // Validate required fields
    if (!transactionId || !senderName || !amountPaid || !selectedNetwork) {
      toast({
        title: "Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Get the logged-in agent's details from localStorage
      const userStr = localStorage.getItem("agent");
      if (!userStr) {
        throw new Error("User not logged in");
      }
      const user = JSON.parse(userStr);
  
      // Prepare the order data
      const orderData = {
        agentId: user.uid, // Use the agent's uid
        agentName: user.name, // Use the agent's name
        customerPhone: "", // You can add a form to collect this
        product: `${selectedCarrier} - ${selectedPackage.name}`, // Include carrier and package name
        amount: packagePrice, // Use the package price
        paymentMethod: "Mobile Money", // Default payment method
        paymentNetwork: selectedNetwork, // Selected payment network (MTN or Telecel)
        transactionId, // Transaction ID
        senderName, // Sender's name
        status: "pending", // Default status
        notes: `Package: ${selectedPackage.name}, Data: ${selectedPackage.data}, Validity: ${selectedPackage.validity}`, // Include package details
      };
  
      // Send a POST request to create the order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
  
      // Show success toast
      toast({
        title: "Order Placed",
        description: `Your order for ${selectedPackage.name} has been placed successfully.`,
      });
  
      // Reset form and close modal
      setTransactionId("");
      setSenderName("");
      setAmountPaid("");
      setSelectedNetwork("");
      setIsPaymentModalOpen(false);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    }
  };

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
                <Button className="w-full" onClick={() => handlePurchaseClick(pkg)}>
                  Purchase Package
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium">{selectedPackage.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPackage.data} | {selectedPackage.validity}
                </div>
                <div className="text-lg font-bold">{selectedPackage.price}</div>
              </div>
            )}

            {/* Network Selection */}
            <div>
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
            <div>
              <Label>Transaction ID</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
            <div>
              <Label>Sender Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender's name"
              />
            </div>
            <div>
              <Label>Amount Paid</Label>
              <Input
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
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
  );
}