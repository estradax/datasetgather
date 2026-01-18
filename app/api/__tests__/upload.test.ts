import { POST } from "../upload/route";
import { NextRequest } from "next/server";
import { supabase } from "../../../lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock supabase
vi.mock("../../../lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
    },
  },
}));

describe("Upload API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if no file is provided", async () => {
    const req = {
      formData: vi.fn().mockResolvedValue({
        get: (key: string) => (key === "label" ? "A" : null),
      }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("No file uploaded");
  });

  it("returns 400 if no label is provided", async () => {
    const req = {
      formData: vi.fn().mockResolvedValue({
        get: (key: string) => (key === "file" ? { name: "test.jpg" } : null),
      }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("No label provided");
  });

  it("returns 200 and success message on successful upload", async () => {
    const mockFile = { name: "test.jpg", type: "image/jpeg" };
    const req = {
      formData: vi.fn().mockResolvedValue({
        get: (key: string) => (key === "file" ? mockFile : "A"),
      }),
    } as unknown as NextRequest;

    (supabase.storage.from("").upload as any).mockResolvedValue({
      data: { path: "A/uuid.jpg" },
      error: null,
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("File uploaded successfully");
    expect(body.path).toBe("A/uuid.jpg");
  });

  it("returns 500 if supabase upload fails", async () => {
    const mockFile = { name: "test.jpg", type: "image/jpeg" };
    const req = {
      formData: vi.fn().mockResolvedValue({
        get: (key: string) => (key === "file" ? mockFile : "A"),
      }),
    } as unknown as NextRequest;

    (supabase.storage.from("").upload as any).mockResolvedValue({
      data: null,
      error: { message: "Upload failed" },
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Upload failed");
  });
});
