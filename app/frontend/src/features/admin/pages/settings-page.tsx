import { useState } from "react"
import { useWeddingSettings } from "@/shared/hooks/use-data"
import { mockService } from "@/shared/utils/mock-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Switch } from "@/shared/ui/switch"
import { Label } from "@/shared/ui/label"
import { Save, Calendar, MapPin, Key, Users } from "lucide-react"

export default function SettingsAdminPage() {
  const { settings, mutate } = useWeddingSettings()
  const [form, setForm] = useState({
    brideName1: settings?.brideName1 || "",
    brideName2: settings?.brideName2 || "",
    weddingDate: settings?.weddingDate || "",
    venueName: settings?.venueName || "",
    venueAddress: settings?.venueAddress || "",
    heroTitle: settings?.heroTitle || "",
    heroSubtitle: settings?.heroSubtitle || "",
    guestPassword: settings?.guestPassword || "",
    adminPassword: settings?.adminPassword || "",
    enableWishes: settings?.enableWishes ?? true,
    enableChallenges: settings?.enableChallenges ?? true,
    requireApprovalForWishes: settings?.requireApprovalForWishes ?? true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await mockService.updateSettings(form)
    await mutate()
    setIsSaving(false)
  }

  // Update form when settings load
  if (settings && !form.brideName1 && settings.brideName1) {
    setForm({
      brideName1: settings.brideName1,
      brideName2: settings.brideName2,
      weddingDate: settings.weddingDate,
      venueName: settings.venueName,
      venueAddress: settings.venueAddress,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      guestPassword: settings.guestPassword,
      adminPassword: settings.adminPassword,
      enableWishes: settings.enableWishes,
      enableChallenges: settings.enableChallenges,
      requireApprovalForWishes: settings.requireApprovalForWishes,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your wedding website settings</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gold hover:bg-gold/90 text-background"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Couple Info */}
        <Card className="bg-card/50 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-gold" />
              Couple Information
            </CardTitle>
            <CardDescription>Names and hero section content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brideName1">First Bride</Label>
                <Input
                  id="brideName1"
                  value={form.brideName1}
                  onChange={(e) => setForm({ ...form, brideName1: e.target.value })}
                  placeholder="Olivia"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <Label htmlFor="brideName2">Second Bride</Label>
                <Input
                  id="brideName2"
                  value={form.brideName2}
                  onChange={(e) => setForm({ ...form, brideName2: e.target.value })}
                  placeholder="Emma"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="Olivia & Emma"
                className="mt-1 bg-background/50 border-gold/30"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="We found our forever in each other..."
                className="mt-1 bg-background/50 border-gold/30"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Wedding Details */}
        <Card className="bg-card/50 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-gold" />
              Wedding Details
            </CardTitle>
            <CardDescription>Date and venue information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Input
                id="weddingDate"
                type="date"
                value={form.weddingDate}
                onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                className="mt-1 bg-background/50 border-gold/30"
              />
            </div>
            <div>
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                placeholder="The Grand Estate"
                className="mt-1 bg-background/50 border-gold/30"
              />
            </div>
            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Textarea
                id="venueAddress"
                value={form.venueAddress}
                onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
                placeholder="123 Wedding Lane, City, State"
                className="mt-1 bg-background/50 border-gold/30"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card className="bg-card/50 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="w-5 h-5 text-gold" />
              Access Control
            </CardTitle>
            <CardDescription>Passwords for guests and admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guestPassword">Guest Password</Label>
              <Input
                id="guestPassword"
                type="text"
                value={form.guestPassword}
                onChange={(e) => setForm({ ...form, guestPassword: e.target.value })}
                placeholder="Enter guest password"
                className="mt-1 bg-background/50 border-gold/30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Guests use this to access challenges and submit photos
              </p>
            </div>
            <div>
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="Enter admin password"
                className="mt-1 bg-background/50 border-gold/30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this to access the admin panel
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="bg-card/50 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-gold" />
              Feature Settings
            </CardTitle>
            <CardDescription>Enable or disable features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableWishes">Enable Wishes</Label>
                <p className="text-xs text-muted-foreground">
                  Allow guests to submit wishes
                </p>
              </div>
              <Switch
                id="enableWishes"
                checked={form.enableWishes}
                onCheckedChange={(checked) => setForm({ ...form, enableWishes: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableChallenges">Enable Photo Challenges</Label>
                <p className="text-xs text-muted-foreground">
                  Allow guests to participate in challenges
                </p>
              </div>
              <Switch
                id="enableChallenges"
                checked={form.enableChallenges}
                onCheckedChange={(checked) => setForm({ ...form, enableChallenges: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireApproval">Require Approval for Wishes</Label>
                <p className="text-xs text-muted-foreground">
                  Wishes must be approved before appearing
                </p>
              </div>
              <Switch
                id="requireApproval"
                checked={form.requireApprovalForWishes}
                onCheckedChange={(checked) => setForm({ ...form, requireApprovalForWishes: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
