"use client"

import { useState } from "react"
import { useStoryMilestones, useCeremonySteps, useGalleryPhotos, usePlaylistTracks } from "@/lib/hooks/use-data"
import { mockService } from "@/lib/services/mock-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Heart, Music, Image, Calendar } from "lucide-react"
import type { StoryMilestone, CeremonyStep, GalleryPhoto, PlaylistTrack } from "@/lib/types"

export default function ContentAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Content Management</h1>
        <p className="text-muted-foreground mt-2">Manage your wedding story, ceremony, gallery, and playlist</p>
      </div>

      <Tabs defaultValue="story">
        <TabsList className="bg-card/50 border border-gold/20">
          <TabsTrigger value="story" className="gap-2">
            <Heart className="w-4 h-4" />
            Story
          </TabsTrigger>
          <TabsTrigger value="ceremony" className="gap-2">
            <Calendar className="w-4 h-4" />
            Ceremony
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Image className="w-4 h-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="playlist" className="gap-2">
            <Music className="w-4 h-4" />
            Playlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="mt-6">
          <StorySection />
        </TabsContent>
        <TabsContent value="ceremony" className="mt-6">
          <CeremonySection />
        </TabsContent>
        <TabsContent value="gallery" className="mt-6">
          <GallerySection />
        </TabsContent>
        <TabsContent value="playlist" className="mt-6">
          <PlaylistSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StorySection() {
  const { milestones, mutate } = useStoryMilestones()
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<StoryMilestone | null>(null)
  const [form, setForm] = useState({ date: "", title: "", description: "", imageUrl: "" })

  const handleSave = async () => {
    if (editing) {
      await mockService.updateMilestone(editing.id, form)
    } else {
      await mockService.createMilestone(form)
    }
    mutate()
    setIsOpen(false)
    setEditing(null)
    setForm({ date: "", title: "", description: "", imageUrl: "" })
  }

  const handleEdit = (milestone: StoryMilestone) => {
    setEditing(milestone)
    setForm({
      date: milestone.date,
      title: milestone.title,
      description: milestone.description,
      imageUrl: milestone.imageUrl || "",
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    await mockService.deleteMilestone(id)
    mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Story Milestones</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setEditing(null)
            setForm({ date: "", title: "", description: "", imageUrl: "" })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">
                {editing ? "Edit Milestone" : "Add Milestone"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g., June 2020"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., First Date"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell your story..."
                  className="mt-1 bg-background/50 border-gold/30"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Image URL (optional)</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-gold hover:bg-gold/90 text-background">
                {editing ? "Update" : "Create"} Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {milestones?.map((milestone) => (
          <Card key={milestone.id} className="bg-card/50 border-gold/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {milestone.imageUrl && (
                    <img src={milestone.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="text-sm text-gold">{milestone.date}</p>
                    <p className="font-medium text-foreground">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(milestone)}>
                    <Edit2 className="w-4 h-4 text-gold" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(milestone.id)}>
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CeremonySection() {
  const { steps, mutate } = useCeremonySteps()
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<CeremonyStep | null>(null)
  const [form, setForm] = useState({ order: 1, title: "", description: "", time: "" })

  const handleSave = async () => {
    if (editing) {
      await mockService.updateCeremonyStep(editing.id, form)
    } else {
      await mockService.createCeremonyStep(form)
    }
    mutate()
    setIsOpen(false)
    setEditing(null)
    setForm({ order: (steps?.length || 0) + 1, title: "", description: "", time: "" })
  }

  const handleEdit = (step: CeremonyStep) => {
    setEditing(step)
    setForm({
      order: step.order,
      title: step.title,
      description: step.description,
      time: step.time || "",
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    await mockService.deleteCeremonyStep(id)
    mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Ceremony Steps</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setEditing(null)
            setForm({ order: (steps?.length || 0) + 1, title: "", description: "", time: "" })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">
                {editing ? "Edit Step" : "Add Step"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Order</label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                    className="mt-1 bg-background/50 border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Time (optional)</label>
                  <Input
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g., 3:00 PM"
                    className="mt-1 bg-background/50 border-gold/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Exchange of Vows"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe this moment..."
                  className="mt-1 bg-background/50 border-gold/30"
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-gold hover:bg-gold/90 text-background">
                {editing ? "Update" : "Create"} Step
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {steps?.sort((a, b) => a.order - b.order).map((step) => (
          <Card key={step.id} className="bg-card/50 border-gold/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-medium">
                    {step.order}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{step.title}</p>
                    {step.time && <p className="text-sm text-gold">{step.time}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-1">{step.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(step)}>
                    <Edit2 className="w-4 h-4 text-gold" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(step.id)}>
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function GallerySection() {
  const { photos, mutate } = useGalleryPhotos()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ url: "", caption: "", category: "couple" })

  const handleSave = async () => {
    await mockService.createGalleryPhoto(form)
    mutate()
    setIsOpen(false)
    setForm({ url: "", caption: "", category: "couple" })
  }

  const handleDelete = async (id: string) => {
    await mockService.deleteGalleryPhoto(id)
    mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Gallery Photos</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">Add Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Image URL</label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Caption (optional)</label>
                <Input
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Describe this photo..."
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 p-2 rounded-md bg-background/50 border border-gold/30 text-foreground"
                >
                  <option value="couple">Couple</option>
                  <option value="venue">Venue</option>
                  <option value="guests">Guests</option>
                  <option value="details">Details</option>
                </select>
              </div>
              <Button onClick={handleSave} className="w-full bg-gold hover:bg-gold/90 text-background">
                Add Photo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="bg-card/50 border-gold/20 overflow-hidden group">
            <div className="aspect-square relative">
              <img src={photo.url} alt={photo.caption || ""} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(photo.id)}>
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </Button>
              </div>
            </div>
            {photo.caption && (
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground line-clamp-1">{photo.caption}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function PlaylistSection() {
  const { tracks, mutate } = usePlaylistTracks()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ title: "", artist: "", spotifyUrl: "", significance: "" })

  const handleSave = async () => {
    await mockService.createPlaylistTrack(form)
    mutate()
    setIsOpen(false)
    setForm({ title: "", artist: "", spotifyUrl: "", significance: "" })
  }

  const handleDelete = async (id: string) => {
    await mockService.deletePlaylistTrack(id)
    mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Playlist Tracks</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add Track
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">Add Track</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Song Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., At Last"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Artist</label>
                <Input
                  value={form.artist}
                  onChange={(e) => setForm({ ...form, artist: e.target.value })}
                  placeholder="e.g., Etta James"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Spotify URL (optional)</label>
                <Input
                  value={form.spotifyUrl}
                  onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/..."
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Why this song?</label>
                <Textarea
                  value={form.significance}
                  onChange={(e) => setForm({ ...form, significance: e.target.value })}
                  placeholder="Share why this song is special to you..."
                  className="mt-1 bg-background/50 border-gold/30"
                  rows={2}
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-gold hover:bg-gold/90 text-background">
                Add Track
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tracks?.map((track) => (
          <Card key={track.id} className="bg-card/50 border-gold/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Music className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    {track.significance && (
                      <p className="text-xs text-gold/70 mt-1 italic">{track.significance}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(track.id)}>
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
