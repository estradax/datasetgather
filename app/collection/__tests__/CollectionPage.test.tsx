import { render, screen, fireEvent } from "@testing-library/react";
import CollectionPage from "../page";
import { vi, describe, it, expect } from "vitest";

// Mock nuqs
vi.mock("nuqs", () => ({
  useQueryState: vi.fn(() => ["A", vi.fn()]),
  parseAsString: {
    withDefault: vi.fn(),
  },
}));

// Mock react-query
vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: vi.fn(() => ({
    data: {
      pages: [
        {
          images: [{ id: "1", url: "test.jpg", name: "Test Image" }],
        },
      ],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    status: "success",
  })),
}));

// Mock ImageGallery
vi.mock("@/components/ImageGallery", () => ({
  default: vi.fn(({ images }) => (
    <div data-testid="gallery-mock">
      {images.map((img: any) => (
        <div key={img.id}>{img.name}</div>
      ))}
    </div>
  )),
}));

// Mock Link
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
  it("renders correctly", () => {
    render(<CollectionPage />);
    expect(screen.getByText("Collection")).toBeInTheDocument();
    expect(screen.getByText("Test Image")).toBeInTheDocument();
  });

  it("renders alphabet filter", () => {
    render(<CollectionPage />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });
});
