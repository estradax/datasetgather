"use client";

import { CollectionProvider } from "../../context/CollectionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CollectionProvider>{children}</CollectionProvider>;
}
