import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { BUCKET_NAME } from "../../../constant/bucket";
import { supabase } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const label = formData.get("label") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!label) {
      return NextResponse.json({ error: "No label provided" }, { status: 400 });
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${label}/${uuidv4()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      path: data.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
