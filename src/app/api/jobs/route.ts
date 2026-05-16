import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prismaDB from "@/actions/db";

interface CreateJobPayload {
  title?: unknown;
  company?: unknown;
  location?: unknown;
  type?: unknown;
  description?: unknown;
  salary?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to post a job." },
      { status: 401 }
    );
  }

  let payload: CreateJobPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const title = asTrimmedString(payload.title);
  const company = asTrimmedString(payload.company);
  const location = asTrimmedString(payload.location);
  const type = asTrimmedString(payload.type);
  const description = asTrimmedString(payload.description);
  const salaryValue = asTrimmedString(payload.salary);

  if (!title || !company || !location || !type || !description) {
    return NextResponse.json(
      { error: "Title, company, location, type, and description are required." },
      { status: 400 }
    );
  }

  const job = await prismaDB.job.create({
    data: {
      title,
      company,
      location,
      type,
      description,
      salary: salaryValue || null,
      postedById: session.user.id,
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
