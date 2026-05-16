import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-border/50">
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <span className="text-foreground font-semibold">Hyun</span>
        </div>
        <p className="text-xs opacity-70">
          © {currentYear} IT Interview Prep. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
