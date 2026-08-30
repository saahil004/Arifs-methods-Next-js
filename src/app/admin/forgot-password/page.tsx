import type { Metadata } from "next";
import AuthShell from "@/components/admin/auth-shell";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset Your Password" subtitle="Enter your admin email and we'll send you a reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
