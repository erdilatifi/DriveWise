'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Shield, User, GraduationCap, Crown, Star, Ban, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Larger page size for efficient user management

  const { data, isLoading, error } = useUsers({
    search: searchQuery,
    role: roleFilter,
    isPremium: premiumFilter === 'all' ? undefined : premiumFilter === 'true',
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, premiumFilter]);

  const handleRoleUpdate = async (userId: string, updates: { is_admin?: boolean }) => {
    try {
      await updateUser.mutateAsync({ id: userId, ...updates });
      toast.success(t('admin.roleUpdated'));
    } catch (error) {
      toast.error(t('admin.roleUpdateError'));
    }
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      await updateUser.mutateAsync({ id: userId, is_blocked: isBlocked });
      toast.success(isBlocked ? 'User blocked successfully' : t('admin.statusUpdated'));
    } catch (error) {
      toast.error(t('admin.statusUpdateError'));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;
    
    try {
      await deleteUser.mutateAsync(userId);
      toast.success(t('admin.userDeleted'));
    } catch (error) {
      toast.error(t('admin.deleteUserError'));
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl pt-28"
      >
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToDashboard')}
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.userManagement')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('admin.manageUsersDesc')} ({totalUsers.toLocaleString()})
            </p>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6 border border-border/80 bg-black/80">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.allRoles')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.allRoles')}</SelectItem>
                  <SelectItem value="user">{t('admin.students')}</SelectItem>
                  <SelectItem value="admin">{t('admin.admins')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={premiumFilter} onValueChange={setPremiumFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.allPlans')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.allPlans')}</SelectItem>
                  <SelectItem value="true">{t('admin.premium')}</SelectItem>
                  <SelectItem value="false">{t('admin.free')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Users List */}
        <GlassCard className="overflow-hidden border border-border/80 bg-black/80">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.user')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.role')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.rating')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.status')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.joined')}</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{user.full_name || 'Unnamed User'}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.is_admin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                            <Shield className="w-3 h-3 mr-1" /> Admin
                          </span>
                        )}
                        {!user.is_admin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/10 text-muted-foreground text-xs font-medium border border-white/20">
                            <User className="w-3 h-3 mr-1" /> {t('admin.students')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.app_rating ? (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < user.app_rating!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_premium ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                          <Crown className="w-3 h-3 mr-1" /> {t('admin.premium')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{t('admin.free')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <div className="h-4 w-4 flex flex-col gap-0.5 items-center justify-center">
                              <span className="w-1 h-1 bg-current rounded-full" />
                              <span className="w-1 h-1 bg-current rounded-full" />
                              <span className="w-1 h-1 bg-current rounded-full" />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-black border-border/80">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleRoleUpdate(user.id, { is_admin: !user.is_admin })}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {user.is_admin ? t('admin.removeAdmin') : t('admin.makeAdmin')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={`${user.is_blocked ? 'text-green-400 focus:text-green-300 focus:bg-green-500/10' : 'text-orange-400 focus:text-orange-300 focus:bg-orange-500/10'} cursor-pointer`}
                            onClick={() => handleBlockUser(user.id, !user.is_blocked)}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            {user.is_blocked ? t('admin.unblockUser') : t('admin.blockUser')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('admin.deleteUser')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {data?.users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {t('admin.noUsersFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}
              {' '}
              - {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>
    </div>
  );
}
