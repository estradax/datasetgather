import { render, screen, fireEvent } from "@testing-library/react";
import WebcamCapture from "../WebcamCapture";
import { useCollection } from "../../context/CollectionContext";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock react-webcam
vi.mock("react-webcam", () => {
  return {
    default: vi.fn(() => <div data-testid="mock-webcam" />),
  };
});

// Mock useCollection
vi.mock("../../context/CollectionContext", () => ({
  useCollection: vi.fn(),
}));

describe("WebcamCapture", () => {
  const mockSetIsCapturing = vi.fn();
  const mockSetSelectedLabel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      isCapturing: false,
      setIsCapturing: mockSetIsCapturing,
      countdown: null,
      selectedLabel: "A",
      setSelectedLabel: mockSetSelectedLabel,
    });
  });

  it("renders webcam and basic info", () => {
    render(<WebcamCapture />);

    expect(screen.getByTestId("mock-webcam")).toBeDefined();
    expect(screen.getByText("Dataset Gatherer")).toBeDefined();
    expect(screen.getByText("Collecting for Class: A")).toBeDefined();
  });

  it("toggles capture when start/stop button is clicked", () => {
    render(<WebcamCapture />);

    const startButton = screen.getByText("Start Collection");
    fireEvent.click(startButton);
    expect(mockSetIsCapturing).toHaveBeenCalledWith(true);

    // Mock capturing state
    (useCollection as any).mockReturnValue({
      isCapturing: true,
      setIsCapturing: mockSetIsCapturing,
      countdown: null,
      selectedLabel: "A",
      setSelectedLabel: mockSetSelectedLabel,
    });

    render(<WebcamCapture />);
    const stopButton = screen.getByText("Stop Collection");
    fireEvent.click(stopButton);
    expect(mockSetIsCapturing).toHaveBeenCalledWith(false);
  });

  it("shows countdown when capturing", () => {
    (useCollection as any).mockReturnValue({
      isCapturing: true,
      setIsCapturing: mockSetIsCapturing,
      countdown: 3,
      selectedLabel: "A",
      setSelectedLabel: mockSetSelectedLabel,
    });

    render(<WebcamCapture />);
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("RECORDING")).toBeDefined();
  });

  it("calls setSelectedLabel(null) when Change Label is clicked", () => {
    render(<WebcamCapture />);

    const changeLabelButton = screen.getByText("Change Label");
    fireEvent.click(changeLabelButton);

    expect(mockSetIsCapturing).toHaveBeenCalledWith(false);
    expect(mockSetSelectedLabel).toHaveBeenCalledWith(null);
  });
});
