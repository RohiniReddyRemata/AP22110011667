import { getUsers, getUserPosts, getPostComments, type User, type Post, type Comment } from "@/lib/api"
import PostCard from "@/components/post-card"

interface PostWithCommentsAndAuthor {
  post: Post
  comments: Comment[]
  author?: User
  commentCount: number
}

async function getTrendingPosts(): Promise<PostWithCommentsAndAuthor[]> {
  const users = await getUsers()
  const userMap = new Map<string, User>()
  users.forEach((user) => userMap.set(user.id, user))

  const allPosts: Post[] = []
  for (const user of users) {
    const userPosts = await getUserPosts(user.id)
    allPosts.push(...userPosts)
  }

  const postsWithComments: PostWithCommentsAndAuthor[] = await Promise.all(
    allPosts.map(async (post) => {
      const comments = await getPostComments(post.id)
      return {
        post,
        comments,
        author: userMap.get(post.userid.toString()),
        commentCount: comments.length,
      }
    }),
  )
  const maxCommentCount = Math.max(...postsWithComments.map((p) => p.commentCount))

  return postsWithComments.filter((p) => p.commentCount === maxCommentCount).sort((a, b) => b.post.id - a.post.id) 
}

export default async function TrendingPostsPage() {
  const trendingPosts = await getTrendingPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trending Posts</h1>
        <p className="text-muted-foreground">Posts with the highest number of comments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingPosts.map((item) => (
          <PostCard
            key={item.post.id}
            post={item.post}
            author={item.author}
            comments={item.comments}
            highlightComments={true}
          />
        ))}
      </div>

      {trendingPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trending posts found</p>
        </div>
      )}
    </div>
  )
}

