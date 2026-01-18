import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { BUCKET_NAME } from "../../../../constant/bucket";

export async function GET() {
  try {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const counts = await Promise.all(
      letters.map(async (letter) => {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(letter);

        if (error) {
          console.error(`Error fetching count for letter ${letter}:`, error);
          return { letter, count: 0 };
        }

        return { letter, count: data?.length || 0 };
      }),
    );

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Error in collection count API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
