"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface CapturedImage {
  id: string;
  url: string;
  timestamp: Date;
  label: string;
}

interface CollectionContextType {
  selectedLabel: string | null;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string | null>>;
  isCapturing: boolean;
  setIsCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  countdown: number | null;
  setCountdown: React.Dispatch<React.SetStateAction<number | null>>;
  capturedImages: CapturedImage[];
  addCapturedImage: (image: CapturedImage) => void;
  clearImages: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined,
);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  const addCapturedImage = useCallback((image: CapturedImage) => {
    setCapturedImages((prev) => [image, ...prev]);
  }, []);

  const clearImages = useCallback(() => {
    setCapturedImages([]);
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        selectedLabel,
        setSelectedLabel,
        isCapturing,
        setIsCapturing,
        countdown,
        setCountdown,
        capturedImages,
        addCapturedImage,
        clearImages,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
