import type { AdminRole } from "@/models/admin";

export type Permission =
  | "content:read"
  | "content:write"
  | "content:delete"
  | "leads:read"
  | "leads:update"
  | "leads:delete"
  | "settings:manage"
  | "admins:manage";

const editorPermissions: readonly Permission[] = [
  "content:read",
  "content:write",
  "leads:read",
  "leads:update",
  "settings:manage",
];

const rolePermissions: Record<AdminRole, ReadonlySet<Permission>> = {
  // Editors can create and edit, but never delete data or manage admins.
  editor: new Set(editorPermissions),
  admin: new Set<Permission>([
    ...editorPermissions,
    "content:delete",
    "leads:delete",
    "admins:manage",
  ]),
};

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}

export const canDelete = (role: AdminRole) => hasPermission(role, "content:delete");
export const canManageAdmins = (role: AdminRole) => hasPermission(role, "admins:manage");
