import { renderHook, act } from "@testing-library/react";
import { CollectionProvider, useCollection } from "../CollectionContext";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock nuqs
vi.mock("nuqs", () => ({
  useQueryState: vi.fn(() => ["A", vi.fn()]),
  parseAsString: {
    withDefault: vi.fn(),
  },
}));

describe("CollectionContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CollectionProvider>{children}</CollectionProvider>
  );

  it("provides initial state", () => {
    const { result } = renderHook(() => useCollection(), { wrapper });

    expect(result.current.selectedLabel).toBe("A"); // Based on mock
    expect(result.current.isCapturing).toBe(false);
    expect(result.current.capturedImages).toEqual([]);
  });

  it("can start and stop capturing", () => {
    const { result } = renderHook(() => useCollection(), { wrapper });

    act(() => {
      result.current.setIsCapturing(true);
    });
    expect(result.current.isCapturing).toBe(true);

    act(() => {
      result.current.setIsCapturing(false);
    });
    expect(result.current.isCapturing).toBe(false);
  });

  it("can add captured images", () => {
    const { result } = renderHook(() => useCollection(), { wrapper });

    const newImage = {
      id: "test-id",
      url: "test-url",
      timestamp: new Date(),
      label: "A",
      status: "pending" as const,
    };

    act(() => {
      result.current.addCapturedImage(newImage);
    });

    expect(result.current.capturedImages).toHaveLength(1);
    expect(result.current.capturedImages[0]).toEqual(newImage);
  });

  it("can update image status", () => {
    const { result } = renderHook(() => useCollection(), { wrapper });

    const newImage = {
      id: "test-id",
      url: "test-url",
      timestamp: new Date(),
      label: "A",
      status: "pending" as const,
    };

    act(() => {
      result.current.addCapturedImage(newImage);
    });

    act(() => {
      result.current.updateImageStatus("test-id", "success");
    });

    expect(result.current.capturedImages[0].status).toBe("success");
  });

  it("can clear images", () => {
    const { result } = renderHook(() => useCollection(), { wrapper });

    const newImage = {
      id: "test-id",
      url: "test-url",
      timestamp: new Date(),
      label: "A",
      status: "pending" as const,
    };

    act(() => {
      result.current.addCapturedImage(newImage);
    });

    act(() => {
      result.current.clearImages();
    });

    expect(result.current.capturedImages).toEqual([]);
  });
});
