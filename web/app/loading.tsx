export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
      
      <div className="text-center relative z-10">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">Loading DriveWise</p>
          <p className="text-sm text-muted-foreground">Preparing your learning experience...</p>
        </div>
      </div>
    </div>
  );
}
