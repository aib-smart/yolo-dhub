"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
// import { supabaseAdmin } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase/supabase.admin"

interface DataPackage {
  id: string
  carrier: "MTN" | "AIRTELTIGO" | "TELECEL"
  name: string
  data: string
  validity: string
  price: number
  active: boolean
  popular: boolean
}

const carriers = ["MTN", "AIRTELTIGO", "TELECEL"]

export function PackageManagement() {
  const [packages, setPackages] = useState<DataPackage[]>([])
  const [selectedCarrier, setSelectedCarrier] = useState<"MTN" | "AIRTELTIGO" | "TELECEL">("MTN")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<DataPackage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    data: "",
    validity: "",
    price: "",
    carrier: "MTN",
    active: true,
    popular: false,
  })

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("packages")
        .select("*")
        .eq("carrier", selectedCarrier.toLowerCase())
        .order("price", { ascending: true })

      if (error) throw error
      setPackages(data)
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load packages",
      })
    }
  }, [selectedCarrier, toast])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const packageData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        carrier: formData.carrier.toLowerCase(),
      }

      if (editingPackage) {
        // Update existing package
        const { error } = await supabaseAdmin.from("packages").update(packageData).eq("id", editingPackage.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Package updated successfully",
        })
      } else {
        // Create new package
        const { error } = await supabaseAdmin.from("packages").insert([packageData])

        if (error) throw error

        toast({
          title: "Success",
          description: "Package created successfully",
        })
      }

      // Reset form and refresh packages
      setFormData({
        name: "",
        data: "",
        validity: "",
        price: "",
        carrier: "MTN",
        active: true,
        popular: false,
      })
      setIsDialogOpen(false)
      setEditingPackage(null)
      fetchPackages()
    } catch (error) {
      console.error("Error saving package:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save package",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      const { error } = await supabaseAdmin.from("packages").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Success",
        description: "Package deleted successfully",
      })
      fetchPackages()
    } catch (error) {
      console.error("Error deleting package:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete package",
      })
    }
  }

  const handleEdit = (pkg: DataPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      data: pkg.data,
      validity: pkg.validity,
      price: pkg.price.toString(),
      carrier: pkg.carrier,
      active: pkg.active,
      popular: pkg.popular,
    })
    setIsDialogOpen(true)
  }

  const togglePackageStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseAdmin.from("packages").update({ active: !currentStatus }).eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Package ${currentStatus ? "deactivated" : "activated"} successfully`,
      })
      fetchPackages()
    } catch (error) {
      console.error("Error toggling package status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update package status",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Data Packages</h2>
          <p className="text-muted-foreground">Manage available internet packages</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

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
                <TableHead>Popular</TableHead>
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
                  <TableCell>
                    <Switch checked={pkg.active} onCheckedChange={() => togglePackageStatus(pkg.id, pkg.active)} />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={pkg.popular}
                      onCheckedChange={async () => {
                        try {
                          const { error } = await supabaseAdmin
                            .from("packages")
                            .update({ popular: !pkg.popular })
                            .eq("id", pkg.id)
                          if (error) throw error
                          fetchPackages()
                        } catch (error) {
                          console.error("Error updating popular status:", error)
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to update popular status",
                          })
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(pkg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(pkg.id)}
                      >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            <DialogDescription>Enter the details for the data package</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Carrier</Label>
              <Select value={formData.carrier} onValueChange={(val) => setFormData({ ...formData, carrier: val })}>
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
              <Label>Package Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Basic Package"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Amount</Label>
                <Input
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  placeholder="e.g., 5GB"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Validity</Label>
                <Input
                  value={formData.validity}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  placeholder="e.g., 30 days"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price (₵)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                />
                <Label>Popular</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingPackage(null)
                  setFormData({
                    name: "",
                    data: "",
                    validity: "",
                    price: "",
                    carrier: "MTN",
                    active: true,
                    popular: false,
                  })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingPackage ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingPackage ? "Update" : "Create"} Package</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

