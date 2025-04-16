"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
            <CardDescription>How can we help you today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's your question about?" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Mail className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  support@mentalwellness.com
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Available 24/7
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <Phone className="h-8 w-8 text-primary" />
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 