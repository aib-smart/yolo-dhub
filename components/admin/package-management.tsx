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

interface DataPackage {
  id: string
  name: string
  data: string
  validity: string
  price: number
  features: string[]
  active: boolean
}

const initialPackages: DataPackage[] = [
  {
    id: "1",
    name: "Basic",
    data: "5GB",
    validity: "30 days",
    price: 50.0,
    features: ["4G LTE", "No Speed Cap"],
    active: true,
  },
  {
    id: "2",
    name: "Standard",
    data: "15GB",
    validity: "30 days",
    price: 100.0,
    features: ["4G LTE", "No Speed Cap", "Roll Over Data"],
    active: true,
  },
  {
    id: "3",
    name: "Premium",
    data: "Unlimited",
    validity: "30 days",
    price: 200.0,
    features: ["5G Ready", "No Speed Cap", "Priority Support"],
    active: false,
  },
]

export function PackageManagement() {
  const [packages, setPackages] = useState<DataPackage[]>(initialPackages)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<DataPackage | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setIsDialogOpen(false)
    setEditingPackage(null)
  }

  const togglePackageStatus = (id: string) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, active: !pkg.active } : pkg)))
  }

  return (
    <div className="space-y-6">
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
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" placeholder="e.g., Basic Package" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data Amount</Label>
                  <Input id="data" placeholder="e.g., 5GB" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validity">Validity</Label>
                  <Input id="validity" placeholder="e.g., 30 days" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₵)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features</Label>
                <Input id="features" placeholder="Comma separated features" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" />
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead className="text-right">Price (₵)</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.data}</TableCell>
                  <TableCell>{pkg.validity}</TableCell>
                  <TableCell className="text-right">{pkg.price.toFixed(2)}</TableCell>
                  <TableCell>{pkg.features.join(", ")}</TableCell>
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

