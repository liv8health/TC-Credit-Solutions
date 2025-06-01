import { Outlet } from "wouter";
import { PublicNavigation } from "./PublicNavigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
