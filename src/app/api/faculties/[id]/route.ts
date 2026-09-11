import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: params.id },
      include: {
        subjects: { orderBy: { nom: "asc" } },
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}
