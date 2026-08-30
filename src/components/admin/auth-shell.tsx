import Image from "next/image";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src="/login.png" alt="" fill sizes="50vw" className="object-cover" />
      </div>

      <div className="relative flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
        {/* Below lg the image panel above is hidden entirely, which left this
            side a bare white page — reuse the same image as a full-bleed
            background here, dimmed so the form stays readable. */}
        <div className="absolute inset-0 lg:hidden">
          <Image src="/login.png" alt="" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/75" />
        </div>

        <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            {/* Brand mark only — deliberately not a link. Nothing on this
                page should offer a way back to the public site. */}
            <img src="/logo-icon.svg" alt="" className="h-8 w-auto" />
            <span className="text-lg font-bold tracking-tight text-navy">Arif&apos;s Methods</span>
          </div>

          <h1 className="mt-10 text-2xl font-extrabold text-navy">{title}</h1>
          <p className="mt-2 text-navy/60">{subtitle}</p>

          {children}
        </div>
      </div>
    </main>
  );
}
