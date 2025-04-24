import Link from "next/link"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/chat" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Chat
      </Link>
      <Link href="/mood-tracker" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Mood Tracker
      </Link>
      <Link href="/help" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Help
      </Link>
    </div>
  )
} 