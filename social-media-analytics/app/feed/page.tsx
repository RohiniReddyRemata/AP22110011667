import { Suspense } from "react"
import { getUsers, getUserPosts, type User, type Post } from "@/lib/api"
import PostCard from "@/components/post-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


async function getAllPosts() {

  const users = await getUsers()
  const userMap = new Map<string, User>()
  users.forEach((user) => userMap.set(user.id, user))


  const allPosts: Array<{ post: Post; author: User }> = []
  for (const user of users) {
    const userPosts = await getUserPosts(user.id)
    userPosts.forEach((post) => {
      allPosts.push({
        post,
        author: user,
      })
    })
  }


  return allPosts.sort((a, b) => b.post.id - a.post.id)
}

async function PostFeed() {
  const allPosts = await getAllPosts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {allPosts.map(({ post, author }) => (
        <PostCard 
          key={`${author.id}-${post.id}`} 
          post={post} 
          author={author} 
          showCommentCount={false} 
        />
      ))}
    </div>
  )
}

function PostSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-4 w-32" />
      </div>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-muted-foreground">Latest posts from all users, newest first</p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <PostFeed />
      </Suspense>
    </div>
  )
}

