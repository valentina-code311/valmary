"use client"

import { useState } from "react"
import { useChallenges, useChallengeSubmissions } from "@/lib/hooks/use-data"
import { mockService } from "@/lib/services/mock-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Camera, Trophy, Users, Check, X } from "lucide-react"
import type { Challenge, ChallengeSubmission } from "@/lib/types"

export default function ChallengesAdminPage() {
  const { challenges, mutate: mutateChallenges } = useChallenges()
  const { submissions, mutate: mutateSubmissions } = useChallengeSubmissions()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newChallenge, setNewChallenge] = useState({ title: "", description: "", points: 10 })

  const handleCreateChallenge = async () => {
    if (!newChallenge.title || !newChallenge.description) return
    await mockService.createChallenge({
      title: newChallenge.title,
      description: newChallenge.description,
      points: newChallenge.points,
      isActive: true,
    })
    mutateChallenges()
    setNewChallenge({ title: "", description: "", points: 10 })
    setIsCreateOpen(false)
  }

  const handleToggleChallenge = async (id: string, isActive: boolean) => {
    await mockService.updateChallenge(id, { isActive: !isActive })
    mutateChallenges()
  }

  const handleApproveSubmission = async (id: string) => {
    await mockService.updateSubmissionStatus(id, "approved")
    mutateSubmissions()
  }

  const handleRejectSubmission = async (id: string) => {
    await mockService.updateSubmissionStatus(id, "rejected")
    mutateSubmissions()
  }

  const pendingSubmissions = submissions?.filter((s) => s.status === "pending") || []
  const activeChallengess = challenges?.filter((c) => c.isActive) || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Photo Challenges</h1>
          <p className="text-muted-foreground mt-2">Manage photo challenges and review guest submissions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              New Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-gold/30">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">Create New Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  placeholder="e.g., Best Dance Move"
                  className="mt-1 bg-background/50 border-gold/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Describe what guests need to capture..."
                  className="mt-1 bg-background/50 border-gold/30"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Points</label>
                <Input
                  type="number"
                  value={newChallenge.points}
                  onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) || 0 })}
                  className="mt-1 bg-background/50 border-gold/30 w-24"
                />
              </div>
              <Button onClick={handleCreateChallenge} className="w-full bg-gold hover:bg-gold/90 text-background">
                Create Challenge
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold/10">
                <Trophy className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeChallengess.length}</p>
                <p className="text-sm text-muted-foreground">Active Challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Camera className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingSubmissions.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-500/10">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{submissions?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges">
        <TabsList className="bg-card/50 border border-gold/20">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions
            {pendingSubmissions.length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white">{pendingSubmissions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges?.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onToggle={() => handleToggleChallenge(challenge.id, challenge.isActive)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions?.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                challenge={challenges?.find((c) => c.id === submission.challengeId)}
                onApprove={() => handleApproveSubmission(submission.id)}
                onReject={() => handleRejectSubmission(submission.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChallengeCard({
  challenge,
  onToggle,
}: {
  challenge: Challenge
  onToggle: () => void
}) {
  return (
    <Card className="bg-card/50 border-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-foreground">{challenge.title}</CardTitle>
            <Badge variant="outline" className="mt-2 border-gold/30 text-gold">
              {challenge.points} points
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={challenge.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-muted text-muted-foreground"}
          >
            {challenge.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="border-gold/30 text-foreground hover:bg-gold/10"
        >
          {challenge.isActive ? "Deactivate" : "Activate"}
        </Button>
      </CardContent>
    </Card>
  )
}

function SubmissionCard({
  submission,
  challenge,
  onApprove,
  onReject,
}: {
  submission: ChallengeSubmission
  challenge?: Challenge
  onApprove: () => void
  onReject: () => void
}) {
  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  }

  return (
    <Card className="bg-card/50 border-gold/20 overflow-hidden">
      <div className="aspect-square relative bg-muted">
        <img
          src={submission.imageUrl}
          alt="Submission"
          className="object-cover w-full h-full"
        />
        <Badge
          variant="outline"
          className={`absolute top-2 right-2 ${statusColors[submission.status]}`}
        >
          {submission.status}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <p className="font-medium text-foreground">{submission.guestName}</p>
        <p className="text-sm text-muted-foreground">{challenge?.title || "Unknown Challenge"}</p>
        {submission.caption && (
          <p className="text-sm text-foreground/80 mt-2 italic">&quot;{submission.caption}&quot;</p>
        )}
        {submission.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={onApprove}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
