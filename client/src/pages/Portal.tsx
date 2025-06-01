import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Dashboard } from "@/components/portal/Dashboard";
import { Chat } from "@/components/portal/Chat";
import { Documents } from "@/components/portal/Documents";
import { Progress } from "@/components/portal/Progress";
import { Resources } from "@/components/portal/Resources";
import { Billing } from "@/components/portal/Billing";
import { AdminPanel } from "@/components/portal/AdminPanel";

export default function Portal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <PortalLayout>
      <Switch>
        <Route path="/portal" component={Dashboard} />
        <Route path="/portal/chat" component={Chat} />
        <Route path="/portal/documents" component={Documents} />
        <Route path="/portal/progress" component={Progress} />
        <Route path="/portal/resources" component={Resources} />
        <Route path="/portal/admin" component={AdminPanel} />
        <Route path="/portal/billing" component={Billing} />
        <Route component={Dashboard} />
      </Switch>
    </PortalLayout>
  );
}
