import { render, screen } from "@testing-library/react";
import Home from "../page";
import { describe, it, expect, vi } from "vitest";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => <a href={href}>{children}</a>,
  };
});

describe("Landing Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText("SignGather")).toBeDefined();
  });

  it("renders the description", () => {
    render(<Home />);
    expect(
      screen.getByText(
        /Pengambilan Dataset Abjad Bahasa Isyarat dengan target 150 gambar per abjad/i,
      ),
    ).toBeDefined();
  });

  it("renders the action buttons with correct links", () => {
    render(<Home />);

    const startLink = screen.getByText("Mulai Ambil Data").closest("a");
    expect(startLink).toHaveAttribute("href", "/collect");

    const collectionLink = screen.getByText("Lihat Koleksi").closest("a");
    expect(collectionLink).toHaveAttribute("href", "/collection");
  });
});
