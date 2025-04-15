import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartPulse, Calendar, MessageSquare, BarChart3, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <Image
              src="/ChatGPT Image Apr 10, 2025, 11_57_53 AM.png"
              alt="Mental Wellness Logo"
              width={128}
              height={128}
              className="rounded-full bg-background p-2"
            />
            <div className="absolute -right-1 -bottom-1">
              <Sparkles className="h-8 w-8 text-[#9D7FEA]" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Your Mental Wellness Companion
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to support your journey to better mental health, one step at a time.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <p className="italic text-center text-muted-foreground">
          "Self-care is not self-indulgence, it is self-preservation."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <Card className="flex flex-col border-none shadow-md bg-gradient-to-b from-background to-primary/5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Supportive Chat</CardTitle>
            <CardDescription>Talk about your feelings in a safe, judgment-free space</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Our compassionate AI assistant is here to listen, provide support, and offer helpful resources whenever
              you need it.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/chatbot" className="w-full">
              <Button className="w-full rounded-lg" size="lg">
                Start Chatting
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-none shadow-md bg-gradient-to-b from-background to-primary/5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Mood Journal</CardTitle>
            <CardDescription>Track your emotional wellbeing journey</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Record how you're feeling each day and discover patterns that can help you understand your emotional
              health better.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/mood-tracker" className="w-full">
              <Button className="w-full rounded-lg" size="lg">
                Track Mood
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-none shadow-md bg-gradient-to-b from-background to-primary/5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Find Support</CardTitle>
            <CardDescription>Connect with caring professionals</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Schedule sessions with compassionate therapists who are ready to provide the personalized support you
              deserve.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/therapist-booking" className="w-full">
              <Button className="w-full rounded-lg" size="lg">
                Find Therapist
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-none shadow-md bg-gradient-to-b from-background to-primary/5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Community Circle</CardTitle>
            <CardDescription>You're not alone on this journey</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Share experiences and find strength in our supportive community where everyone is welcome and valued.</p>
          </CardContent>
          <CardFooter>
            <Link href="/community" className="w-full">
              <Button className="w-full rounded-lg" size="lg">
                Join Community
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">How We Support Your Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-medium mb-2">Express Yourself</h3>
            <p className="text-muted-foreground text-sm">Share your thoughts and feelings in a safe space</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-medium mb-2">Track Progress</h3>
            <p className="text-muted-foreground text-sm">Monitor your emotional wellbeing over time</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-medium mb-2">Find Support</h3>
            <p className="text-muted-foreground text-sm">Connect with professionals and community</p>
          </div>
        </div>
      </div>
    </div>
  )
}

