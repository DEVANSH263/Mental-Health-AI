"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MessageSquare, ThumbsUp, User, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Post = {
  id: number
  author: {
    name: string
    avatar?: string
  }
  content: string
  topic: string
  likes: number
  comments: number
  timestamp: Date
  isLiked?: boolean
  isFlagged?: boolean
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
      },
      content:
        "I've been practicing mindfulness meditation for the past month and it's really helped with my anxiety. The 5-minute morning sessions have made a big difference in how I start my day. Has anyone else tried this?",
      topic: "Anxiety",
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg",
      },
      content:
        "Today was a tough day, but I managed to use some of the coping strategies my therapist suggested. I took short breaks, practiced deep breathing, and went for a walk. Small wins matter! 💪",
      topic: "Depression",
      likes: 32,
      comments: 12,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg",
      },
      content:
        "I'm looking for book recommendations on dealing with grief. I've been struggling since losing my grandmother last month, and I think reading might help me process my feelings. Any suggestions would be appreciated. ❤️",
      topic: "Grief",
      likes: 18,
      comments: 15,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ])

  const [newPost, setNewPost] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("General")

  const topics = ["General", "Anxiety", "Depression", "Stress", "Grief", "Self-Care", "Relationships"]

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    // In a real app, this would be sent to your backend for toxicity detection
    const post: Post = {
      id: posts.length + 1,
      author: {
        name: "You",
        avatar: "/placeholder.svg",
      },
      content: newPost,
      topic: selectedTopic,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
    }

    setPosts([post, ...posts])
    setNewPost("")
    setSelectedTopic("General")
  }

  const handleLikePost = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          }
        }
        return post
      }),
    )
  }

  const handleFlagPost = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            isFlagged: !post.isFlagged,
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Community Circle
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Connect with others who understand what you're going through. Share experiences, find support, and grow
          together.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Community Tip:</span> Sharing your experiences can help others feel less
              alone. Remember that vulnerability is a strength, not a weakness.
            </p>
          </div>
        </div>
      </div>

      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Community Guidelines</AlertTitle>
        <AlertDescription>
          This is a safe space for everyone. Please be respectful, supportive, and kind in all interactions. We're all
          here to support each other's mental health journey.
        </AlertDescription>
      </Alert>

      <Card className="mb-8 border rounded-xl shadow-md overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle>Share with the Community</CardTitle>
          <CardDescription>Your experiences might help someone else feel less alone</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="What would you like to share today? How are you feeling?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="resize-none border-primary/20 focus-visible:ring-primary/30 rounded-lg"
            />
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className={`cursor-pointer rounded-full px-3 py-1 ${
                    selectedTopic === topic ? "" : "border-primary/20 hover:bg-primary/5 hover:text-primary"
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-primary/5">
          <Button onClick={handleCreatePost} disabled={!newPost.trim()} className="rounded-lg">
            Share with Community
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-primary/10">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="popular" className="rounded-md data-[state=active]:bg-primary/10">
              Popular
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-md data-[state=active]:bg-primary/10">
              Recent
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`border rounded-xl shadow-md overflow-hidden ${post.isFlagged ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-2 bg-primary/5">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="border border-primary/20">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {post.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                    {post.topic}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 p-4">
                <p className="whitespace-pre-line">{post.content}</p>
                {post.isFlagged && (
                  <div className="mt-2 text-sm text-muted-foreground italic">
                    This post has been flagged for review by our moderation team.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-primary/5">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={post.isLiked ? "text-primary" : ""}
                    onClick={() => handleLikePost(post.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={post.isFlagged ? "text-destructive" : ""}
                  onClick={() => handleFlagPost(post.id)}
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {post.isFlagged ? "Flagged" : "Flag"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {posts
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map((post) => (
              <Card
                key={post.id}
                className={`border rounded-xl shadow-md overflow-hidden ${post.isFlagged ? "opacity-60" : ""}`}
              >
                <CardHeader className="pb-2 bg-primary/5">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="border border-primary/20">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {post.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                      {post.topic}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 p-4">
                  <p className="whitespace-pre-line">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between bg-primary/5">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={post.isLiked ? "text-primary" : ""}
                      onClick={() => handleLikePost(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleFlagPost(post.id)}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {post.isFlagged ? "Flagged" : "Flag"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {posts
            .slice()
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map((post) => (
              <Card
                key={post.id}
                className={`border rounded-xl shadow-md overflow-hidden ${post.isFlagged ? "opacity-60" : ""}`}
              >
                <CardHeader className="pb-2 bg-primary/5">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="border border-primary/20">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {post.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                      {post.topic}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 p-4">
                  <p className="whitespace-pre-line">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between bg-primary/5">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={post.isLiked ? "text-primary" : ""}
                      onClick={() => handleLikePost(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleFlagPost(post.id)}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {post.isFlagged ? "Flagged" : "Flag"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      <div className="mt-8 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Community Support</h2>
        <p className="text-muted-foreground mb-6">
          Remember that sharing and connecting with others can be an important part of your mental health journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Be Kind</h3>
            <p className="text-sm text-muted-foreground">Support others with compassion and understanding</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Share Safely</h3>
            <p className="text-sm text-muted-foreground">Only share what you're comfortable with</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Celebrate Progress</h3>
            <p className="text-sm text-muted-foreground">Acknowledge every step forward, no matter how small</p>
          </div>
        </div>
      </div>
    </div>
  )
}

