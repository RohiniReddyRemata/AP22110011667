import Image from "next/image"
import type { Post, User, Comment } from "@/lib/api"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

interface PostCardProps {
  post: Post
  author?: User
  comments?: Comment[]
  showCommentCount?: boolean
  highlightComments?: boolean
}

export default function PostCard({
  post,
  author,
  comments = [],
  showCommentCount = true,
  highlightComments = false,
}: PostCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <Image
              src={`/placeholder.svg?height=40&width=40&text=${author?.name?.charAt(0) || "U"}`}
              alt={author?.name || "User"}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{author?.name || `User ${post.userid}`}</h3>
            <p className="text-xs text-muted-foreground">Post #{post.id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={post.imageUrl || `/placeholder.svg?height=200&width=400&text=Post+${post.id}`}
          alt={post.content}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <p>{post.content}</p>
        </div>
      </CardContent>
      <CardFooter className={`flex items-center gap-2 text-sm ${highlightComments ? "bg-primary/5" : ""}`}>
        <MessageCircle className="w-4 h-4" />
        {showCommentCount ? <span>{comments.length} comments</span> : <span>Comments</span>}

        {highlightComments && comments.length > 0 && (
          <span className="ml-auto font-semibold text-primary">Most commented!</span>
        )}
      </CardFooter>

      {highlightComments && comments.length > 0 && (
        <div className="px-4 pb-4">
          <h4 className="font-medium mb-2">Recent Comments</h4>
          <div className="space-y-2">
            {comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="bg-muted p-2 rounded-md text-sm">
                {comment.content}
              </div>
            ))}
            {comments.length > 3 && (
              <p className="text-xs text-muted-foreground">+ {comments.length - 3} more comments</p>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

