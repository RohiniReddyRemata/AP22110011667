import { getUsers, getUserPosts, type User } from "@/lib/api"
import UserCard from "@/components/user-card"

async function getTopUsers(): Promise<Array<User & { postCount: number }>> {
  const users = await getUsers()

  const usersWithPostCounts = await Promise.all(
    users.map(async (user) => {
      const posts = await getUserPosts(user.id)
      return {
        ...user,
        postCount: posts.length,
      }
    }),
  )

  return usersWithPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5)
}

export default async function TopUsersPage() {
  const topUsers = await getTopUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Top Users</h1>
        <p className="text-muted-foreground">The top 5 users with the most posts on the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topUsers.map((user, index) => (
          <UserCard key={user.id} user={user} postCount={user.postCount} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

