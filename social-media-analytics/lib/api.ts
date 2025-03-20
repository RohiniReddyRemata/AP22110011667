const API_BASE_URL = "http://20.244.56.144/test"
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc3MTg4LCJpYXQiOjE3NDI0NzY4ODgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjIzMGRhMGFkLTUzN2QtNDVmOC1iNmM1LTRiNDA3YTJkMGU4ZiIsInN1YiI6InJvaGluaXJlZGR5X3JAc3JtYXAuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIiwiY2xpZW50SUQiOiIyMzBkYTBhZC01MzdkLTQ1ZjgtYjZjNS00YjQwN2EyZDBlOGYiLCJjbGllbnRTZWNyZXQiOiJiTExLbk5tVW9iSm1wSlFGIiwib3duZXJOYW1lIjoiUmVtYXRhIFJvaGluaSBSZWRkeSIsIm93bmVyRW1haWwiOiJyb2hpbmlyZWRkeV9yQHNybWFwLmVkdS5pbiIsInJvbGxObyI6IkFQMjIxMTAwMTE2NjcifQ.SJM2_oTc919ozwHxLRdtQXI6wvFM_GmtGOa5trZAM20"
export interface User {
  id: string
  name: string
}

export interface Post {
  id: number
  userid: number
  content: string
  imageUrl?: string
}

export interface Comment {
  id: number
  postid: number
  content: string
}

export interface UsersResponse {
  users: Record<string, string>
}

export interface PostsResponse {
  posts: Post[]
}

export interface CommentsResponse {
  comments: Comment[]
}

export function getRandomImageUrl(seed: number): string {
  return `/placeholder.svg?height=200&width=400&text=Image+${seed}`
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const data: UsersResponse = await response.json()
    
    if (!data?.users || typeof data.users !== 'object') {
      console.error('Invalid users data received:', data)
      return []
    }

    return Object.entries(data.users).map(([id, name]) => ({
      id,
      name,
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    const data: PostsResponse = await response.json()

    return data.posts.map((post) => ({
      ...post,
      imageUrl: getRandomImageUrl(post.id),
    }))
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    const data: CommentsResponse = await response.json()

    return data.comments
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

