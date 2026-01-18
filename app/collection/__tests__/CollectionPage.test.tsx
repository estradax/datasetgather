import { render, screen, fireEvent } from "@testing-library/react";
import CollectionPage from "../page";
import { useQueryState } from "nuqs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock nuqs
vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
  parseAsString: {
    withDefault: vi.fn(),
  },
}));

// Mock @tanstack/react-query
vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: vi.fn(),
}));

// Mock ImageGallery
vi.mock("@/components/ImageGallery", () => ({
  default: vi.fn(({ images }: { images: any[] }) => (
    <div data-testid="image-gallery">{images.length} images loaded</div>
  )),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Collection Page", () => {
  const mockSetSelectedLetter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryState as any).mockReturnValue(["A", mockSetSelectedLetter]);
    (useInfiniteQuery as any).mockReturnValue({
      data: {
        pages: [{ images: [{ id: "1", url: "url1" }], nextOffset: 1 }],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetching: false,
      isFetchingNextPage: false,
      status: "success",
    });
  });

  it("renders alphabet filters", () => {
    render(<CollectionPage />);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach((letter) => {
      expect(screen.getByText(letter)).toBeDefined();
    });
  });

  it("renders the image gallery with data", () => {
    render(<CollectionPage />);

    expect(screen.getByTestId("image-gallery")).toBeDefined();
    expect(screen.getByText("1 images loaded")).toBeDefined();
  });

  it("calls setSelectedLetter when a filter is clicked", () => {
    render(<CollectionPage />);

    const buttonB = screen.getByText("B");
    fireEvent.click(buttonB);

    expect(mockSetSelectedLetter).toHaveBeenCalledWith("B");
  });

  it("renders the back link", () => {
    render(<CollectionPage />);
    const backLink = screen.getByRole("link");
    expect(backLink).toHaveAttribute("href", "/");
  });
});
