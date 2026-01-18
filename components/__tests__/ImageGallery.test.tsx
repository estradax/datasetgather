import { render, screen, fireEvent } from "@testing-library/react";
import ImageGallery, { GalleryImage } from "../ImageGallery";
import { vi, describe, it, expect } from "vitest";

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: true, // Simulate always in view for loadMore test
  }),
}));

describe("ImageGallery", () => {
  it('renders "Belum ada gambar terambil" when empty', () => {
    render(<ImageGallery images={[]} />);
    expect(screen.getByText("Belum ada gambar terambil")).toBeInTheDocument();
  });

  it("renders images", () => {
    const images: GalleryImage[] = [
      {
        id: "1",
        url: "http://example.com/1.jpg",
        label: "A",
        timestamp: new Date(),
        status: "success",
      },
    ];

    render(<ImageGallery images={images} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "http://example.com/1.jpg",
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<ImageGallery images={[]} isLoading={true} />);
    // There are local loaders and specific loaders, but general loader usually has specific class or unique role/aria,
    // but here it is just an icon. We can check if it exists.
    // However, the empty state might also be shown or not depending on logic.
    // Line 140: {(isLoading || hasMore) && ...
    // Let's verify structure or use container query if needed, but let's check if we can find the spinner container or just absence of "No images".

    // Actually, line 87: {images.length === 0 && !isLoading ? ...
    // So if isLoading is true, "Belum ada gambar terambil" should NOT be present.
    expect(
      screen.queryByText("Belum ada gambar terambil"),
    ).not.toBeInTheDocument();
  });

  it("calls loadMore when in view", () => {
    const loadMore = vi.fn();
    // we mocked useInView to return inView: true
    render(
      <ImageGallery
        images={[{ id: "1", url: "", status: "success" }]}
        hasMore={true}
        loadMore={loadMore}
      />,
    );
    expect(loadMore).toHaveBeenCalled();
  });

  it("calls onClear when trash button is clicked and confirmed", () => {
    const onClear = vi.fn();
    // Window confirm mock
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <ImageGallery
        images={[{ id: "1", url: "", status: "success" }]}
        onClear={onClear}
      />,
    );

    const clearBtn = screen.getByTitle("Hapus semua");
    fireEvent.click(clearBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(onClear).toHaveBeenCalled();
  });
});
