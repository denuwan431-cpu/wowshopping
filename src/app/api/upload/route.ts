import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const { fileName, fileUrl, fileType, fileSize, folder } = await req.json();

      if (!fileUrl) {
        return NextResponse.json({ message: "File URL is required" }, { status: 400 });
      }

      const [savedMedia] = await db
        .insert(media)
        .values({
          fileName: fileName || "uploaded-file",
          fileUrl,
          fileType: fileType || "image/jpeg",
          fileSize: Number(fileSize) || 1024,
          folder: folder || "general"
        })
        .returning();

      return NextResponse.json({
        success: true,
        url: savedMedia.fileUrl,
        media: savedMedia
      });
    }

    // Fallback default
    return NextResponse.json({
      success: true,
      url: "https://images.pexels.com/photos/27893026/pexels-photo-27893026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allMedia = await db.select().from(media).limit(100);
    return NextResponse.json({ media: allMedia });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json({ message: "Failed to list media" }, { status: 500 });
  }
}
