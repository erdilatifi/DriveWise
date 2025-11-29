import { GlassCard } from "@/components/ui/glass-card";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Welcome / Stats Skeleton */}
        <div className="grid gap-6 md:grid-cols-[1fr,auto]">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-primary/10 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-muted/10 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-primary/5 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-primary/5 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i} className="p-5 border-border/50 bg-black/40 h-32 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="h-8 w-8 rounded-lg bg-primary/10 animate-pulse" />
                <div className="h-4 w-12 bg-muted/10 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-16 bg-muted/20 rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted/10 rounded animate-pulse" />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <GlassCard className="h-96 border-border/50 bg-black/40 p-6">
            <div className="h-6 w-40 bg-muted/20 rounded mb-6 animate-pulse" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-muted/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </GlassCard>
          
          <div className="space-y-6">
            <GlassCard className="h-64 border-border/50 bg-black/40 p-6">
               <div className="h-6 w-32 bg-muted/20 rounded mb-4 animate-pulse" />
               <div className="h-full bg-muted/5 rounded-xl animate-pulse" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
