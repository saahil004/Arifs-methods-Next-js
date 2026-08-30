export default function AdminFooter() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.svg" alt="" className="h-7 w-auto brightness-0 invert" />
          <span className="text-sm font-bold tracking-tight text-white">Arif&apos;s Methods</span>
        </div>

        <p className="text-sm text-white/60">© {new Date().getFullYear()} Arif&apos;s Methods. All rights reserved.</p>

        <a href="tel:+923333025215" className="text-sm text-white/60 transition-colors hover:text-amber">
          Contact developer: Saahil — 0333 3025215
        </a>
      </div>
    </footer>
  );
}
