import { BUCKET_NAME } from "@/constant/bucket";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const letter = searchParams.get("letter");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!letter) {
    return NextResponse.json({ error: "Letter is required" }, { status: 400 });
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(letter, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      images: [],
      nextOffset: null,
    });
  }

  const paths = data.map((file) => `${letter}/${file.name}`);

  const { data: signedUrls, error: signedUrlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrls(paths, 60 * 60);

  if (signedUrlError) {
    return NextResponse.json(
      { error: signedUrlError.message },
      { status: 500 },
    );
  }

  const result = signedUrls
    .map((item) => {
      if (!item.path) return null;
      return {
        id: item.path,
        url: item.signedUrl,
        name: item.path.split("/").pop() || "unknown",
      };
    })
    .filter((item) => item !== null);

  // Determine if there are more items
  const nextOffset = data.length === limit ? offset + limit : null;

  return NextResponse.json({
    images: result,
    nextOffset,
  });
}
