import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="flex items-center space-x-2">
        <div className="relative w-12 h-12">
          <Image
            src="/ChatGPT Image Apr 10, 2025, 11_57_53 AM.png"
            alt="Mental Wellness Logo"
            width={48}
            height={48}
            className="rounded-full bg-background p-1"
          />
        </div>
        <span className="font-medium hidden md:inline-block">Mental Wellness</span>
      </Link>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/chatbot" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Chat Support
      </Link>
      <Link
        href="/mood-tracker"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Mood Journal
      </Link>
      <Link
        href="/therapist-booking"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Find Support
      </Link>
      <Link
        href="/community"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Community
      </Link>
    </nav>
  )
}

