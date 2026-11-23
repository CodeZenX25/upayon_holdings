import { getCurrentAdmin } from "@/lib/auth/server";
import { canDelete, canManageAdmins } from "@/lib/auth/permissions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null; // layout redirects

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-900">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Signed in as {admin.email}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delete content</CardTitle>
            <CardDescription>{canDelete(admin.role) ? "Allowed" : "Not allowed for editors"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage admins</CardTitle>
            <CardDescription>
              {canManageAdmins(admin.role) ? "Allowed" : "Not allowed for editors"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
