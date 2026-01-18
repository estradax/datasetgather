import { GET } from "../route";
import { supabase } from "../../../../../lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// Mock Supabase
vi.mock("../../../../../lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      list: vi.fn(),
    },
  },
}));

// Mock NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      data,
      init,
      status: init?.status || 200,
    })),
  },
}));

describe("GET /api/collection/count", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns counts for all letters", async () => {
    const mockList = vi.mocked(supabase.storage.from("").list);

    // Mock successful response for each letter
    mockList.mockImplementation(async (path) => {
      if (path === "A")
        return {
          data: [
            {
              name: "img1.jpg",
              id: "1",
              bucket_id: "b",
              owner: "o",
              updated_at: "t",
              created_at: "t",
              last_accessed_at: "t",
              metadata: {},
            },
            {
              name: "img2.jpg",
              id: "2",
              bucket_id: "b",
              owner: "o",
              updated_at: "t",
              created_at: "t",
              last_accessed_at: "t",
              metadata: {},
            },
          ] as any,
          error: null,
        };
      if (path === "B")
        return {
          data: [
            {
              name: "img3.jpg",
              id: "3",
              bucket_id: "b",
              owner: "o",
              updated_at: "t",
              created_at: "t",
              last_accessed_at: "t",
              metadata: {},
            },
          ] as any,
          error: null,
        };
      return { data: [], error: null };
    });

    const response: any = await GET();

    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(26);
    expect(response.data.find((c: any) => c.letter === "A")).toEqual({
      letter: "A",
      count: 2,
    });
    expect(response.data.find((c: any) => c.letter === "B")).toEqual({
      letter: "B",
      count: 1,
    });
    expect(response.data.find((c: any) => c.letter === "C")).toEqual({
      letter: "C",
      count: 0,
    });
  });

  it("handles error for a specific letter gracefully", async () => {
    const mockList = vi.mocked(supabase.storage.from("").list);

    mockList.mockImplementation(async (path) => {
      if (path === "A")
        return { data: null, error: new Error("Supabase error") as any };
      return { data: [], error: null };
    });

    const response: any = await GET();

    expect(response.status).toBe(200);
    expect(response.data.find((c: any) => c.letter === "A")).toEqual({
      letter: "A",
      count: 0,
    });
  });

  it("returns 500 when an unexpected error occurs", async () => {
    const mockList = vi.mocked(supabase.storage.from("").list);
    mockList.mockRejectedValue(new Error("Unexpected error"));

    const response: any = await GET();

    expect(response.status).toBe(500);
    expect(response.data).toEqual({ error: "Internal Server Error" });
  });
});
