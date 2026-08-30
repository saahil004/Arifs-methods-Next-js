import type { Metadata } from "next";
import AuthShell from "@/components/admin/auth-shell";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a New Password" subtitle="Choose a new password for your admin account.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
