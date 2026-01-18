import { render, screen, fireEvent } from "@testing-library/react";
import LabelSelector from "../LabelSelector";
import { useCollection } from "../../context/CollectionContext";
import { useQuery } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock useCollection
vi.mock("../../context/CollectionContext", () => ({
  useCollection: vi.fn(),
}));

// Mock useQuery
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("LabelSelector", () => {
  const mockSetSelectedLabel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      setSelectedLabel: mockSetSelectedLabel,
    });
    (useQuery as any).mockReturnValue({
      data: [
        { letter: "A", count: 5 },
        { letter: "B", count: 1 },
      ],
      isLoading: false,
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

  it("displays the correct image counts for each letter", () => {
    render(<LabelSelector />);

    // Check letter A (5 images)
    expect(screen.getByText("5 images")).toBeDefined();

    // Check letter B (1 image - singular)
    expect(screen.getByText("1 image")).toBeDefined();

    // Check letter C (0 images - default)
    const buttons = screen.getAllByRole("button");
    const buttonC = buttons.find((b) => b.textContent?.includes("C"));
    expect(buttonC?.textContent).toContain("0 images");
  });
});
