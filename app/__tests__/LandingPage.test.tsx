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
    expect(screen.getByText("Dataset Gather")).toBeDefined();
  });

  it("renders the description", () => {
    render(<Home />);
    expect(
      screen.getByText(
        /Effortless image collection for your machine learning datasets/i,
      ),
    ).toBeDefined();
  });

  it("renders the action buttons with correct links", () => {
    render(<Home />);

    const startLink = screen.getByText("Start Collecting").closest("a");
    expect(startLink).toHaveAttribute("href", "/collect");

    const collectionLink = screen.getByText("See Collection").closest("a");
    expect(collectionLink).toHaveAttribute("href", "/collection");
  });
});
