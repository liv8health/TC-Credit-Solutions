import { ReactNode } from "react";
import { PortalSidebar } from "./PortalSidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TrendingUp, X } from "lucide-react";
import { Link } from "wouter";

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Portal Header */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary-foreground text-primary rounded-lg p-2 mr-3">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">TC Credit Solutions Portal</h2>
            <p className="text-primary-foreground/80">Member Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="outline" />
          <Link href="/">
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close portal</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Portal Body */}
      <div className="flex-1 flex overflow-hidden">
        <PortalSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
