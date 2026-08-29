import InfoDrawer from "./info-drawer";
import MobileMenu from "./mobile-menu";
import DesktopNav from "./desktop-nav";
import HeaderShell from "./header-shell";
import HeaderLogo from "./header-logo";

export default function Header() {
  return (
    <HeaderShell>
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <HeaderLogo />
        <DesktopNav />
        <div className="flex items-center gap-3">
          <InfoDrawer />
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
