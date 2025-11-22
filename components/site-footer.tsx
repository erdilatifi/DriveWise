import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-black/80 backdrop-blur-sm w-full relative">
      <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 relative">
            <div className="pointer-events-none hidden md:block absolute -left-6 top-1/2 h-10 w-px -translate-y-1/2 bg-gradient-to-b from-orange-500/40 via-orange-300/10 to-transparent" />
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-400/70 bg-black/60 flex items-center justify-center">
              <Image
                src="/logo-white.png"
                alt="DriveWise Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                DriveWise
              </span>
              <span className="text-xs text-muted-foreground">
                Kosovo&apos;s Premier Driving Theory Platform
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            &copy; 2024 DriveWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
