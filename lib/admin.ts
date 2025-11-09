export const ADMIN_USER_ID = '49b5bb08-7ed2-41ff-a4a2-5af9fa14cf85';

export function isAdmin(userId: string | undefined): boolean {
  return userId === ADMIN_USER_ID;
}
