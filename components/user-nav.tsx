"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, UserCircle, KeyRound, UserPlus, LogOut, Lock, HelpCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserNav() {
  const router = useRouter()
  const isLoggedIn = false // This would come from your auth state management

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log("Signing out...")
    router.push("/auth/signin")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/5">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="/placeholder-user.jpg" alt="User Profile" className="object-cover" />
            <AvatarFallback className="bg-primary/5">
              <User className="h-5 w-5 text-primary/70" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoggedIn ? "John Doe" : "Guest User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {isLoggedIn ? "john.doe@example.com" : "Sign in to access all features"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <UserCircle className="w-4 h-4 mr-2" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/privacy" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <Lock className="w-4 h-4 mr-2" />
                <span>Privacy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help & Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer p-2 hover:bg-red-50 text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/auth/signin" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <KeyRound className="w-4 h-4 mr-2" />
                <span>Sign In</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/signup" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <UserPlus className="w-4 h-4 mr-2" />
                <span>Create Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help & Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact" className="flex items-center cursor-pointer p-2 hover:bg-primary/5">
                <Mail className="w-4 h-4 mr-2" />
                <span>Contact Us</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

