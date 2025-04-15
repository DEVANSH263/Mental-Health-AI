"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Star, Video, Sparkles } from "lucide-react"

type Therapist = {
  id: number
  name: string
  specialty: string[]
  rating: number
  image: string
  availability: string[]
  price: number
  online: boolean
  inPerson: boolean
  bio: string
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: ["Anxiety", "Depression", "Stress Management"],
    rating: 4.9,
    image: "/placeholder.svg",
    availability: ["Monday", "Wednesday", "Friday"],
    price: 120,
    online: true,
    inPerson: true,
    bio: "I believe in creating a warm, supportive environment where you can feel safe to explore your thoughts and feelings. My approach is collaborative and compassionate.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: ["Trauma", "PTSD", "Relationship Issues"],
    rating: 4.8,
    image: "/placeholder.svg",
    availability: ["Tuesday", "Thursday", "Saturday"],
    price: 135,
    online: true,
    inPerson: false,
    bio: "My practice focuses on helping people heal from past trauma and build healthier relationships. I use evidence-based approaches tailored to your unique needs.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: ["Depression", "Grief", "Life Transitions"],
    rating: 4.7,
    image: "/placeholder.svg",
    availability: ["Monday", "Tuesday", "Thursday"],
    price: 110,
    online: true,
    inPerson: true,
    bio: "I specialize in helping people navigate difficult life transitions and process grief. My approach is gentle, patient, and focused on your individual journey.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: ["Addiction", "Substance Abuse", "Recovery"],
    rating: 4.9,
    image: "/placeholder.svg",
    availability: ["Wednesday", "Friday", "Saturday"],
    price: 125,
    online: true,
    inPerson: true,
    bio: "With over 15 years of experience in addiction recovery, I provide a non-judgmental space to support your journey toward healing and sustainable recovery.",
  },
]

export default function TherapistBookingPage() {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined)
  const [sessionType, setSessionType] = useState<"online" | "in-person">("online")

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleBookAppointment = () => {
    // In a real app, this would send the booking request to your backend
    alert(
      `Your session with ${selectedTherapist?.name} has been scheduled for ${date?.toLocaleDateString()} at ${timeSlot}. We look forward to supporting you!`,
    )
    setSelectedTherapist(null)
    setDate(undefined)
    setTimeSlot(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Find Your Support
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Connect with compassionate professionals who are here to support your mental health journey.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">Finding the Right Fit:</span> It's important to find a therapist you feel
              comfortable with. Feel free to book initial consultations with different therapists to find your best
              match.
            </p>
          </div>
        </div>
      </div>

      {selectedTherapist ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="md:col-span-1 border rounded-xl shadow-md overflow-hidden bg-gradient-to-b from-background to-primary/5">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
                  <AvatarImage src={selectedTherapist.image} alt={selectedTherapist.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedTherapist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{selectedTherapist.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span>{selectedTherapist.rating}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {selectedTherapist.specialty.map((spec) => (
                    <Badge
                      key={spec}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-none"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Available on: {selectedTherapist.availability.join(", ")}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <p className="font-medium">${selectedTherapist.price} per session</p>
                </div>
                <div className="flex gap-2 mt-2">
                  {selectedTherapist.online && (
                    <div className="flex items-center text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Online
                    </div>
                  )}
                  {selectedTherapist.inPerson && (
                    <div className="flex items-center text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      In-person
                    </div>
                  )}
                </div>
                <p className="text-sm italic mt-4 border-t pt-4">{selectedTherapist.bio}</p>
              </div>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-lg" onClick={() => setSelectedTherapist(null)}>
                Back to Therapists
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 border rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle>Schedule Your Session</CardTitle>
              <CardDescription>Choose a time that works best for you</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-3 bg-card"
                    disabled={(date) =>
                      date < new Date() ||
                      !selectedTherapist.availability.includes(date.toLocaleDateString("en-US", { weekday: "long" }))
                    }
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Select Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={timeSlot === time ? "default" : "outline"}
                          className={`justify-start rounded-lg ${timeSlot === time ? "" : "border-primary/20 hover:bg-primary/5"}`}
                          onClick={() => setTimeSlot(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Session Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={sessionType === "online" ? "default" : "outline"}
                        className={`flex-1 rounded-lg ${sessionType === "online" ? "" : "border-primary/20 hover:bg-primary/5"}`}
                        onClick={() => setSessionType("online")}
                        disabled={!selectedTherapist.online}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Online
                      </Button>
                      <Button
                        variant={sessionType === "in-person" ? "default" : "outline"}
                        className={`flex-1 rounded-lg ${sessionType === "in-person" ? "" : "border-primary/20 hover:bg-primary/5"}`}
                        onClick={() => setSessionType("in-person")}
                        disabled={!selectedTherapist.inPerson}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        In-person
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-primary/5">
              <Button
                onClick={handleBookAppointment}
                disabled={!date || !timeSlot}
                className="w-full rounded-lg"
                size="lg"
              >
                Schedule Your Session
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Supportive Professionals</h2>
              <p className="text-sm text-muted-foreground">Find someone who resonates with your needs</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="depression">Depression</SelectItem>
                  <SelectItem value="trauma">Trauma</SelectItem>
                  <SelectItem value="addiction">Addiction</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Day</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <Card
                key={therapist.id}
                className="overflow-hidden border rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="pb-2 bg-primary/5">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-primary/20">
                        <AvatarImage src={therapist.image} alt={therapist.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {therapist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{therapist.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                          <span className="text-sm">{therapist.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${therapist.price}</p>
                      <p className="text-xs text-muted-foreground">per session</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {therapist.specialty.slice(0, 2).map((spec) => (
                      <Badge
                        key={spec}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-none"
                      >
                        {spec}
                      </Badge>
                    ))}
                    {therapist.specialty.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{therapist.specialty.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    Available: {therapist.availability.join(", ")}
                  </div>
                  <div className="flex gap-2">
                    {therapist.online && (
                      <div className="flex items-center text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Online
                      </div>
                    )}
                    {therapist.inPerson && (
                      <div className="flex items-center text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        In-person
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic">{therapist.bio}</p>
                </CardContent>
                <CardFooter className="bg-primary/5">
                  <Button className="w-full rounded-lg" onClick={() => setSelectedTherapist(therapist)}>
                    Schedule Session
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

