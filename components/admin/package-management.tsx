"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPackage {
  id: string
  carrier: "MTN" | "AIRTELTIGO" | "TELECEL"
  name: string
  data: string
  validity: string
  price: number
  active: boolean
}

const initialPackages: DataPackage[] = [
  {
    id: "1",
    carrier: "MTN",
    name: "Basic",
    data: "5GB",
    validity: "30 days",
    price: 50.0,
    active: true,
  },
  {
    id: "2",
    carrier: "MTN",
    name: "Standard",
    data: "15GB",
    validity: "30 days",
    price: 100.0,
    active: true,
  },
  {
    id: "3",
    carrier: "MTN",
    name: "Premium",
    data: "Unlimited",
    validity: "30 days",
    price: 200.0,
    active: false,
  },
  {
    id: "4",
    carrier: "AIRTELTIGO",
    name: "Basic",
    data: "4GB",
    validity: "28 days",
    price: 45.0,
    active: true,
  },
  {
    id: "5",
    carrier: "AIRTELTIGO",
    name: "Standard",
    data: "10GB",
    validity: "30 days",
    price: 90.0,
    active: true,
  },
  {
    id: "6",
    carrier: "AIRTELTIGO",
    name: "Premium",
    data: "Unlimited",
    validity: "30 days",
    price: 180.0,
    active: false,
  },
  {
    id: "7",
    carrier: "TELECEL",
    name: "Basic",
    data: "3GB",
    validity: "30 days",
    price: 40.0,
    active: true,
  },
  {
    id: "8",
    carrier: "TELECEL",
    name: "Standard",
    data: "8GB",
    validity: "30 days",
    price: 80.0,
    active: true,
  },
  {
    id: "9",
    carrier: "TELECEL",
    name: "Premium",
    data: "Unlimited",
    validity: "30 days",
    price: 160.0,
    active: false,
  },
]

const carriers = ["MTN", "AIRTELTIGO", "TELECEL"]

export function PackageManagement() {
  const [packages, setPackages] = useState<DataPackage[]>(initialPackages)
  const [selectedCarrier, setSelectedCarrier] = useState<"MTN" | "AIRTELTIGO" | "TELECEL">("MTN")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<DataPackage | null>(null)
  const [newPackage, setNewPackage] = useState<Omit<DataPackage, "id">>({
    carrier: "MTN",
    name: "",
    data: "",
    validity: "",
    price: 0,
    active: true,
  })

  // Filter packages based on the selected carrier
  const filteredPackages = packages.filter((pkg) => pkg.carrier === selectedCarrier)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPackage.name || !newPackage.data || !newPackage.validity || newPackage.price <= 0) return

    if (editingPackage) {
      setPackages(packages.map((pkg) => (pkg.id === editingPackage.id ? { ...pkg, ...newPackage } : pkg)))
    } else {
      setPackages([...packages, { id: (packages.length + 1).toString(), ...newPackage }])
    }

    setIsDialogOpen(false)
    setEditingPackage(null)
    setNewPackage({ carrier: "MTN", name: "", data: "", validity: "", price: 0, active: true })
  }

  const togglePackageStatus = (id: string) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, active: !pkg.active } : pkg)))
  }

  return (
    <div className="space-y-6">
      {/* Header and Modal Trigger */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Data Packages</h2>
          <p className="text-muted-foreground">Manage available internet packages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
              <DialogDescription>Enter the details for the data package</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Select
                  value={newPackage.carrier}
                  onValueChange={(val) =>
                    setNewPackage({ ...newPackage, carrier: val as "MTN" | "AIRTELTIGO" | "TELECEL" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem key={carrier} value={carrier}>
                        {carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  placeholder="e.g., Basic Package"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data Amount</Label>
                  <Input
                    id="data"
                    value={newPackage.data}
                    onChange={(e) => setNewPackage({ ...newPackage, data: e.target.value })}
                    placeholder="e.g., 5GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validity">Validity</Label>
                  <Input
                    id="validity"
                    value={newPackage.validity}
                    onChange={(e) => setNewPackage({ ...newPackage, validity: e.target.value })}
                    placeholder="e.g., 30 days"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₵)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPackage.active}
                  onCheckedChange={(checked) => setNewPackage({ ...newPackage, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingPackage(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingPackage ? "Update" : "Create"} Package</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Carrier Selection for Filtering */}
      <div className="flex space-x-4">
        {carriers.map((carrier) => (
          <Button
            key={carrier}
            variant={carrier === selectedCarrier ? "default" : "outline"}
            onClick={() => setSelectedCarrier(carrier as "MTN" | "AIRTELTIGO" | "TELECEL")}
          >
            {carrier}
          </Button>
        ))}
      </div>

      {/* Packages Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead className="text-right">Price (₵)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.data}</TableCell>
                  <TableCell>{pkg.validity}</TableCell>
                  <TableCell className="text-right">{pkg.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch checked={pkg.active} onCheckedChange={() => togglePackageStatus(pkg.id)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingPackage(pkg)
                          setNewPackage({
                            carrier: pkg.carrier,
                            name: pkg.name,
                            data: pkg.data,
                            validity: pkg.validity,
                            price: pkg.price,
                            active: pkg.active,
                          })
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

