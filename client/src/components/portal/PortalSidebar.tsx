import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  CreditCard,
  ExternalLink,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Chat", href: "/portal/chat", icon: MessageCircle },
  { name: "Documents", href: "/portal/documents", icon: FileText },
  { name: "Progress", href: "/portal/progress", icon: TrendingUp },
  { name: "Resources", href: "/portal/resources", icon: BookOpen },
  { name: "Client Portal", href: "https://g6b8av5oic6p0hnirm8r.app.clientclub.net/login", icon: ExternalLink, external: true },
  { name: "Billing", href: "/portal/billing", icon: CreditCard },
];

export function PortalSidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-muted/30 border-r border-border p-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/portal" && location.startsWith(item.href));
          
          if (item.external) {
            return (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.open(item.href, '_blank')}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            );
          }
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
}
