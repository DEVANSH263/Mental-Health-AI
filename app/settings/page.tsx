"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Moon, Shield, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your account
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Privacy Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Hide your activity from others
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">
                  Change the interface language
                </p>
              </div>
              <Button variant="outline">English</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 