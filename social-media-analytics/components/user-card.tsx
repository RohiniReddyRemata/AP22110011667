import Image from "next/image"
import type { User } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getRandomImageUrl } from "@/lib/api"

interface UserCardProps {
  user: User
  postCount: number
  rank: number
}

export default function UserCard({ user, postCount, rank }: UserCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {rank}
        </div>
        <Image
          src={getRandomImageUrl(Number.parseInt(user.id)) || "/placeholder.svg"}
          alt={user.name}
          width={400}
          height={200}
          className="w-full h-40 object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg">{user.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{postCount}</span> posts
        </p>
      </CardContent>
    </Card>
  )
}

