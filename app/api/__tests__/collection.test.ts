import { GET } from "../collection/route";
import { NextRequest } from "next/server";
import { supabase } from "../../../lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock supabase
vi.mock("../../../lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      list: vi.fn(),
      createSignedUrls: vi.fn(),
    },
  },
}));

describe("Collection API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if letter is missing", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({}),
      },
    } as unknown as NextRequest;

    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Letter is required");
  });

  it("returns images and nextOffset on successful fetch", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({
          letter: "A",
          limit: "2",
          offset: "0",
        }),
      },
    } as unknown as NextRequest;

    (supabase.storage.from("").list as any).mockResolvedValue({
      data: [{ name: "1.jpg" }, { name: "2.jpg" }],
      error: null,
    });

    (supabase.storage.from("").createSignedUrls as any).mockResolvedValue({
      data: [
        { path: "A/1.jpg", signedUrl: "url1" },
        { path: "A/2.jpg", signedUrl: "url2" },
      ],
      error: null,
    });

    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.images).toHaveLength(2);
    expect(body.images[0].url).toBe("url1");
    expect(body.nextOffset).toBe(2);
  });

  it("returns empty list if no data found", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ letter: "A" }),
      },
    } as unknown as NextRequest;

    (supabase.storage.from("").list as any).mockResolvedValue({
      data: [],
      error: null,
    });

    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.images).toHaveLength(0);
    expect(body.nextOffset).toBeNull();
  });

  it("returns 500 if supabase list fails", async () => {
    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ letter: "A" }),
      },
    } as unknown as NextRequest;

    (supabase.storage.from("").list as any).mockResolvedValue({
      data: null,
      error: { message: "List failed" },
    });

    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("List failed");
  });
});
