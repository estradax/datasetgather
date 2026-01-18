import { Suspense } from "react";
import { CollectionProvider } from "../../context/CollectionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <CollectionProvider>{children}</CollectionProvider>
    </Suspense>
  );
}
