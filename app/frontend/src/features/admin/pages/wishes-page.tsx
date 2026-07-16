import { useState } from "react"
import { useWishes } from "@/shared/hooks/use-data"
import { mockService } from "@/shared/utils/mock-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Check, X, Clock, Heart, MessageSquare } from "lucide-react"
import type { Wish } from "@/shared/config/types"

export default function WishesModerationPage() {
  const { wishes, mutate } = useWishes()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const filteredWishes = wishes?.filter((wish) => {
    if (filter === "all") return true
    return wish.status === filter
  })

  const handleApprove = async (id: string) => {
    await mockService.updateWishStatus(id, "approved")
    mutate()
  }

  const handleReject = async (id: string) => {
    await mockService.updateWishStatus(id, "rejected")
    mutate()
  }

  const pendingCount = wishes?.filter((w) => w.status === "pending").length || 0
  const approvedCount = wishes?.filter((w) => w.status === "approved").length || 0
  const rejectedCount = wishes?.filter((w) => w.status === "rejected").length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Wishes Moderation</h1>
        <p className="text-muted-foreground mt-2">Review and moderate guest wishes before they appear publicly</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-500/10">
                <Check className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-rose-500/10">
                <X className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-card/50 border border-gold/20">
          <TabsTrigger value="all">All ({wishes?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="space-y-4">
            {filteredWishes?.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                onApprove={() => handleApprove(wish.id)}
                onReject={() => handleReject(wish.id)}
              />
            ))}
            {filteredWishes?.length === 0 && (
              <Card className="bg-card/50 border-gold/20">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No wishes found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WishCard({
  wish,
  onApprove,
  onReject,
}: {
  wish: Wish
  onApprove: () => void
  onReject: () => void
}) {
  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  }

  return (
    <Card className="bg-card/50 border-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-gold" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-foreground">
                {wish.guestName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(wish.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[wish.status]}>
            {wish.status.charAt(0).toUpperCase() + wish.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 italic mb-4">&quot;{wish.message}&quot;</p>
        {wish.status === "pending" && (
          <div className="flex gap-3">
            <Button
              onClick={onApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
