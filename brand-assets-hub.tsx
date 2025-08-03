"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UsageStatus = "Live" | "Pending" | "Fatigued"
type AssetType = "image" | "video" | "ugc"

interface Asset {
  id: number
  name: string
  fileUrl: string
  type: AssetType
  tags: {
    product: string
    campaign: string
    platform: string
  }
  usageStatus: UsageStatus
  dateUploaded: string
}

export function BrandAssetsHub() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [productTag, setProductTag] = useState("")
  const [campaignTag, setCampaignTag] = useState("")
  const [platformTag, setPlatformTag] = useState("")
  const [usageStatus, setUsageStatus] = useState<UsageStatus>("Pending")
  const [error, setError] = useState("")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("")
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "video/mp4", "video/webm", "video/ogg"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Unsupported file type. Please upload an image or video.")
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const getAssetType = (file: File): AssetType => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    return "ugc"
  }

  const handleAddAsset = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!file) {
      setError("Please select a file to upload.")
      return
    }
    if (!productTag.trim() || !campaignTag.trim() || !platformTag.trim()) {
      setError("Please fill in all tag fields: product, campaign, and platform.")
      return
    }

    const newAsset: Asset = {
      id: Date.now(),
      name: file.name,
      fileUrl: URL.createObjectURL(file),
      type: getAssetType(file),
      tags: {
        product: productTag.trim(),
        campaign: campaignTag.trim(),
        platform: platformTag.trim(),
      },
      usageStatus,
      dateUploaded: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    }

    setAssets((prev) => [newAsset, ...prev])
    // Reset form
    setFile(null)
    setProductTag("")
    setCampaignTag("")
    setPlatformTag("")
    setUsageStatus("Pending")
    // Reset file input value manually
    const fileInput = document.getElementById("fileInput") as HTMLInputElement | null
    if (fileInput) fileInput.value = ""
  }

  const handleUsageStatusChange = (id: number, newStatus: UsageStatus) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, usageStatus: newStatus } : asset
      )
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Assets Hub</CardTitle>
          <CardDescription>
            Store approved brand assets and manage tags and usage status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div>
              <label htmlFor="fileInput" className="block mb-1 font-medium">
                Upload Asset (Image or Video)
              </label>
              <Input
                type="file"
                id="fileInput"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="productTag" className="block mb-1 font-medium">
                  Product Tag
                </label>
                <Input
                  id="productTag"
                  value={productTag}
                  onChange={(e) => setProductTag(e.target.value)}
                  placeholder="Product"
                />
              </div>
              <div>
                <label htmlFor="campaignTag" className="block mb-1 font-medium">
                  Campaign Tag
                </label>
                <Input
                  id="campaignTag"
                  value={campaignTag}
                  onChange={(e) => setCampaignTag(e.target.value)}
                  placeholder="Campaign"
                />
              </div>
              <div>
                <label htmlFor="platformTag" className="block mb-1 font-medium">
                  Platform Tag
                </label>
                <Input
                  id="platformTag"
                  value={platformTag}
                  onChange={(e) => setPlatformTag(e.target.value)}
                  placeholder="Platform"
                />
              </div>
            </div>
            <div>
              <label htmlFor="usageStatus" className="block mb-1 font-medium">
                Usage Status
              </label>
              <Select
                onValueChange={(value) => setUsageStatus(value as UsageStatus)}
                value={usageStatus}
              >
                <SelectTrigger id="usageStatus" className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Fatigued">Fatigued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-600 font-medium">{error}</p>}
            <Button type="submit">Add Asset</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored Brand Assets</CardTitle>
          <CardDescription>Manage your uploaded brand assets</CardDescription>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p>No assets uploaded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Usage Status</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      {asset.type === "image" ? (
                        <img
                          src={asset.fileUrl}
                          alt={asset.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-sm font-medium">
                          {asset.type.toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.tags.product}</TableCell>
                    <TableCell>{asset.tags.campaign}</TableCell>
                    <TableCell>{asset.tags.platform}</TableCell>
                    <TableCell>
                      <Select
                        value={asset.usageStatus}
                        onValueChange={(value) =>
                          handleUsageStatusChange(asset.id, value as UsageStatus)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Live">Live</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Fatigued">Fatigued</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{asset.dateUploaded}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
