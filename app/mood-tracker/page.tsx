"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarChart, Calendar, LineChart, Sparkles } from "lucide-react"

type MoodEntry = {
  id: number
  date: Date
  mood: "great" | "good" | "okay" | "bad" | "terrible"
  notes: string
  sentimentScore?: number
  emotions?: string[]
}

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([
    {
      id: 1,
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      mood: "good",
      notes: "Had a productive day at work and went for a walk in the evening. Feeling more balanced today.",
      sentimentScore: 0.7,
      emotions: ["content", "peaceful", "accomplished"],
    },
    {
      id: 2,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      mood: "okay",
      notes:
        "Feeling a bit overwhelmed with upcoming deadlines, but managed to practice some deep breathing exercises which helped.",
      sentimentScore: 0.5,
      emotions: ["neutral", "thoughtful", "calm"],
    },
    {
      id: 3,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      mood: "great",
      notes:
        "Connected with friends today and felt really present in the moment. Made progress on personal projects too.",
      sentimentScore: 0.9,
      emotions: ["joyful", "grateful", "energetic"],
    },
  ])

  const [currentMood, setCurrentMood] = useState<MoodEntry["mood"]>("okay")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    // In a real app, you would send this to your backend for sentiment analysis
    const newEntry: MoodEntry = {
      id: entries.length + 1,
      date: new Date(),
      mood: currentMood,
      notes: notes,
      // These would normally be calculated by your backend
      sentimentScore: Math.random(),
      emotions: ["simulated", "emotion", "analysis"],
    }

    setEntries([...entries, newEntry])
    setCurrentMood("okay")
    setNotes("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Mood Journal
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Track your emotional wellbeing journey and discover patterns that can help you understand yourself better.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Wellness Tip:</span> Regular mood tracking can help you identify patterns
              and triggers, making it easier to manage your emotional wellbeing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="md:col-span-1 border rounded-xl shadow-md overflow-hidden bg-gradient-to-b from-background to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle>How Are You Today?</CardTitle>
            <CardDescription>Take a moment to check in with yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-center block">Select your mood</Label>
                <RadioGroup
                  value={currentMood}
                  onValueChange={(value) => setCurrentMood(value as MoodEntry["mood"])}
                  className="flex justify-between"
                >
                  <div className="flex flex-col items-center">
                    <RadioGroupItem value="terrible" id="terrible" className="sr-only" />
                    <Label
                      htmlFor="terrible"
                      className={`text-3xl cursor-pointer transition-transform ${currentMood === "terrible" ? "scale-125" : ""}`}
                    >
                      😢
                    </Label>
                    <span className="text-xs mt-1">Struggling</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RadioGroupItem value="bad" id="bad" className="sr-only" />
                    <Label
                      htmlFor="bad"
                      className={`text-3xl cursor-pointer transition-transform ${currentMood === "bad" ? "scale-125" : ""}`}
                    >
                      😕
                    </Label>
                    <span className="text-xs mt-1">Difficult</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RadioGroupItem value="okay" id="okay" className="sr-only" />
                    <Label
                      htmlFor="okay"
                      className={`text-3xl cursor-pointer transition-transform ${currentMood === "okay" ? "scale-125" : ""}`}
                    >
                      😐
                    </Label>
                    <span className="text-xs mt-1">Neutral</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RadioGroupItem value="good" id="good" className="sr-only" />
                    <Label
                      htmlFor="good"
                      className={`text-3xl cursor-pointer transition-transform ${currentMood === "good" ? "scale-125" : ""}`}
                    >
                      🙂
                    </Label>
                    <span className="text-xs mt-1">Good</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RadioGroupItem value="great" id="great" className="sr-only" />
                    <Label
                      htmlFor="great"
                      className={`text-3xl cursor-pointer transition-transform ${currentMood === "great" ? "scale-125" : ""}`}
                    >
                      😄
                    </Label>
                    <span className="text-xs mt-1">Wonderful</span>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Journal entry (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How are you feeling today? What's on your mind?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="resize-none border-primary/20 focus-visible:ring-primary/30"
                />
              </div>

              <Button type="button" onClick={handleSubmit} className="w-full rounded-lg">
                Save Journal Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border rounded-xl shadow-md overflow-hidden">
          <CardHeader className="pb-2 bg-primary/5">
            <CardTitle>Your Wellness Journey</CardTitle>
            <CardDescription>See how your mood changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4 bg-muted/50">
                <TabsTrigger value="chart" className="rounded-md data-[state=active]:bg-primary/10">
                  <LineChart className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-md data-[state=active]:bg-primary/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="entries" className="rounded-md data-[state=active]:bg-primary/10">
                  <BarChart className="h-4 w-4 mr-2" />
                  Journal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <div className="h-[300px] flex items-center justify-center border rounded-md p-4 bg-primary/5">
                  <p className="text-muted-foreground text-center max-w-md">
                    Your mood trend visualization would appear here, showing your emotional patterns over time to help
                    you understand your wellbeing journey.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <div className="h-[300px] flex items-center justify-center border rounded-md p-4 bg-primary/5">
                  <p className="text-muted-foreground text-center max-w-md">
                    A calendar view would display your moods by date, with gentle color coding to help you visualize
                    your emotional patterns throughout the month.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="entries" className="space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="border border-primary/10 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {entry.date.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-3xl">
                            {entry.mood === "terrible" && "😢"}
                            {entry.mood === "bad" && "😕"}
                            {entry.mood === "okay" && "😐"}
                            {entry.mood === "good" && "🙂"}
                            {entry.mood === "great" && "😄"}
                          </div>
                        </div>
                        <p className="text-sm">{entry.notes}</p>
                        {entry.emotions && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {entry.emotions.map((emotion) => (
                              <span key={emotion} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Mood Insights</h2>
        <p className="text-muted-foreground mb-6">
          Understanding your emotional patterns can help you develop better coping strategies and improve your overall
          wellbeing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Track Regularly</h3>
            <p className="text-sm text-muted-foreground">Daily entries help identify patterns more accurately</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Be Specific</h3>
            <p className="text-sm text-muted-foreground">Note what might have influenced your mood each day</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2">Reflect Monthly</h3>
            <p className="text-sm text-muted-foreground">Look back to see your progress and growth</p>
          </div>
        </div>
      </div>
    </div>
  )
}

