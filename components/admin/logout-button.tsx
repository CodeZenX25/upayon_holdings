"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleLogout() {
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/admin/login");
      router.refresh();
    } catch {
      // The cookie is still set — redirecting would bounce straight back here.
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {failed && (
        <span role="alert" className="text-sm text-destructive">
          Sign out failed. Try again.
        </span>
      )}
      <Button variant="outline" onClick={handleLogout} disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
        Sign out
      </Button>
    </div>
  );
}
