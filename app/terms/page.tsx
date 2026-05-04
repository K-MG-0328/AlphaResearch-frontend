import { Suspense } from "react";

import TermsContent from "@/features/auth/ui/components/TermsContent";

export default function TermsPage() {
  return (
    <Suspense>
      <TermsContent />
    </Suspense>
  );
}
