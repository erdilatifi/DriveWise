/**
 * @deprecated This file and the hardcoded ADMIN_USER_ID are deprecated.
 * Admin status is now managed via the 'is_admin' flag in the 'user_profiles' table.
 * Use the useAuth() hook or query the database directly to check for admin permissions.
 */
export const ADMIN_USER_ID = '49b5bb08-7ed2-41ff-a4a2-5af9fa14cf85';

/**
 * @deprecated Use database check instead.
 */
export function isAdmin(userId: string | undefined): boolean {
  return userId === ADMIN_USER_ID;
}
