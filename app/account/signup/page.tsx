import { Suspense } from "react";
import SignupContent from "@/features/auth/ui/components/SignupContent";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
