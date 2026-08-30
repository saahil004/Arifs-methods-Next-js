import type { Metadata } from "next";
import AuthShell from "@/components/admin/auth-shell";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return (
    <AuthShell title="Welcome Back" subtitle="Sign in with your admin email and password to continue.">
      <LoginForm />
    </AuthShell>
  );
}
