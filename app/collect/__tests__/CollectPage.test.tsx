import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Collect from "../page";
import { useCollection } from "../../../context/CollectionContext";
import { vi, describe, it, expect } from "vitest";

// Mock components
vi.mock("../../../components/WebcamCapture", () => ({
  default: vi.fn(({ ref }) => <div data-testid="webcam-mock">Webcam</div>),
}));

vi.mock("../../../components/ImageGallery", () => ({
  default: vi.fn(({ images }) => (
    <div data-testid="gallery-mock">{images.length} images</div>
  )),
}));

vi.mock("../../../components/LabelSelector", () => ({
  default: vi.fn(() => (
    <div data-testid="label-selector-mock">Label Selector</div>
  )),
}));

// Mock Context
vi.mock("../../../context/CollectionContext", () => ({
  useCollection: vi.fn(),
}));

// Mock react-query
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

describe("Collect Page", () => {
  const mockUseCollection = useCollection as unknown as ReturnType<
    typeof vi.fn
  >;

  it("renders LabelSelector when no label is selected", () => {
    mockUseCollection.mockReturnValue({
      selectedLabel: null,
      isCapturing: false,
      setCountdown: vi.fn(),
      addCapturedImage: vi.fn(),
      updateImageStatus: vi.fn(),
      capturedImages: [],
      clearImages: vi.fn(),
    });

    render(<Collect />);
    expect(screen.getByTestId("label-selector-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("webcam-mock")).not.toBeInTheDocument();
  });

  it("renders Webcam and Gallery when label is selected", () => {
    mockUseCollection.mockReturnValue({
      selectedLabel: "A",
      isCapturing: false,
      setCountdown: vi.fn(),
      addCapturedImage: vi.fn(),
      updateImageStatus: vi.fn(),
      capturedImages: [],
      clearImages: vi.fn(),
    });

    render(<Collect />);
    expect(screen.queryByTestId("label-selector-mock")).not.toBeInTheDocument();
    expect(screen.getByTestId("webcam-mock")).toBeInTheDocument();
    expect(screen.getByTestId("gallery-mock")).toBeInTheDocument();
  });
});
