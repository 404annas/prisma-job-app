import { auth } from "@/auth";
import prismaDB from "@/actions/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/singin", request.url));
  }

  try {
    const { jobId } = await params;
    const job = await prismaDB.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const existingApplication = await prismaDB.application.findFirst({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You already have applied for this job", {
        status: 400,
      });
    }

    const application = await prismaDB.application.create({
      data: {
        jobId: jobId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}