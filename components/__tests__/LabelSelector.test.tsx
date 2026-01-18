import { render, screen, fireEvent } from "@testing-library/react";
import LabelSelector from "../LabelSelector";
import { useCollection } from "../../context/CollectionContext";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock useCollection
vi.mock("../../context/CollectionContext", () => ({
  useCollection: vi.fn(),
}));

describe("LabelSelector", () => {
  const mockSetSelectedLabel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      setSelectedLabel: mockSetSelectedLabel,
    });
  });

  it("renders all alphabet buttons", () => {
    render(<LabelSelector />);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach((letter) => {
      expect(screen.getByText(letter)).toBeDefined();
    });
  });

  it("calls setSelectedLabel when a letter is clicked", () => {
    render(<LabelSelector />);

    const buttonA = screen.getByText("A");
    fireEvent.click(buttonA);

    expect(mockSetSelectedLabel).toHaveBeenCalledWith("A");

    const buttonZ = screen.getByText("Z");
    fireEvent.click(buttonZ);

    expect(mockSetSelectedLabel).toHaveBeenCalledWith("Z");
  });

  it("renders the title and description", () => {
    render(<LabelSelector />);

    expect(screen.getByText("Select Label")).toBeDefined();
    expect(
      screen.getByText(/Choose a label to start collecting images/i),
    ).toBeDefined();
  });
});
