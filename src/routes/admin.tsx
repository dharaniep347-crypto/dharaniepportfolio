import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Overview } from "@/components/admin/Overview";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { MessagesAdmin } from "@/components/admin/MessagesAdmin";
import { ProfileAdmin } from "@/components/admin/ProfileAdmin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin | Dharani E P" },
      { name: "description", content: "Manage portfolio projects, messages and profile." },
      { property: "og:title", content: "Admin | Dharani E P" },
      { property: "og:description", content: "Portfolio admin panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(null); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
  };

  if (user === undefined) return <p className="p-10 text-muted-foreground">Loading…</p>;
  if (!user) return <AdminLogin />;
  if (isAdmin === null) return <p className="p-10 text-muted-foreground">Checking access…</p>;
  if (!isAdmin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>This account doesn't have admin access.</p>
        <Button onClick={signOut}>Sign out</Button>
      </div>
    );

  return (
    <div className="min-h-screen">
      <Toaster />
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-wide text-lg">D<span className="text-primary">.</span>EP <span className="text-sm font-normal text-muted-foreground">admin</span></Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><Overview /></TabsContent>
          <TabsContent value="projects"><ProjectsAdmin /></TabsContent>
          <TabsContent value="messages"><MessagesAdmin /></TabsContent>
          <TabsContent value="profile"><ProfileAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
