"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles } from "lucide-react"

type MoodEntry = {
  id: number
  date: Date
  mood: "great" | "good" | "okay" | "bad" | "terrible"
  notes: string
  sentimentScore?: number
  emotions?: string[]
}

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<MoodEntry["mood"]>("okay");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch entries when page loads
  useEffect(() => {
    async function fetchEntries() {
      try {
        console.log('Fetching journal entries...');
        const response = await fetch('/api/journal');
        
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }

        const data = await response.json();
        console.log('Fetched entries:', data);

        // Convert the database entries to MoodEntry format
        const convertedEntries: MoodEntry[] = data.map((entry: any) => ({
          id: entry._id,
          date: new Date(entry.timestamp),
          mood: numberToMood[entry.mood], // Convert number back to mood string
          notes: entry.content,
          sentimentScore: entry.sentiment,
          emotions: entry.tags || [],
        }));

        setEntries(convertedEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, []);

  // Convert number to mood string
  const numberToMood: { [key: number]: MoodEntry["mood"] } = {
    1: "terrible",
    2: "bad",
    3: "okay",
    4: "good",
    5: "great"
  };

  const handleSubmit = async () => {
    if (!notes.trim()) {
      return; // Don't submit if notes are empty
    }

    try {
      console.log('Sending journal entry to API...');
      
      // Convert mood to number (1-5)
      const moodToNumber = {
        terrible: 1,
        bad: 2,
        okay: 3,
        good: 4,
        great: 5
      };

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: notes,
          mood: moodToNumber[currentMood],
          userId: null, // You can add user authentication later
          tags: [], // Optional tags
          activities: [], // Optional activities
        }),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to save journal entry: ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully saved journal entry:', data);

      // Add to local state for immediate UI update
      const newEntry: MoodEntry = {
        id: entries.length + 1,
        date: new Date(),
        mood: currentMood,
        notes: notes,
        sentimentScore: 0,
        emotions: [],
      };

      setEntries([...entries, newEntry]);
      setCurrentMood("okay");
      setNotes("");
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // You might want to show an error message to the user here
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <Card className="border rounded-xl shadow-md overflow-hidden bg-gradient-to-b from-background to-primary/5">
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

        <Card className="border rounded-xl shadow-md overflow-hidden">
          <CardHeader className="pb-2 bg-primary/5">
            <CardTitle>Your Journal Entries</CardTitle>
            <CardDescription>Review your previous entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {entries
                .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort in reverse chronological order
                .map((entry) => (
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
                    {entry.emotions && entry.emotions.length > 0 && (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

