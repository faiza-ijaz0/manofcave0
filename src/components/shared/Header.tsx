import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-primary" />
          <span className="text-2xl font-serif font-bold text-primary">Premium Cuts</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/branches" className="text-foreground hover:text-primary transition-colors">
            Branches
          </Link>
          <Link href="/booking" className="text-foreground hover:text-primary transition-colors">
            Book Now
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary">
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}