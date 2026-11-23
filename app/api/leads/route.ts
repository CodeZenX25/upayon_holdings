import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BodyTooLargeError, readJsonBody } from "@/lib/http";
import { publicLeadSchema } from "@/lib/validations";
import { LeadModel } from "@/models";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { message: "Please submit your enquiry as JSON." },
      { status: 415 },
    );
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request, 16_384);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json(
        { message: "The submitted form is too large." },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { message: "The submitted form data could not be read." },
      { status: 400 },
    );
  }

  // Public submissions must not control internal fields like status or notes.
  const parsed = publicLeadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check your details and try again.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    await LeadModel.create(parsed.data);

    return NextResponse.json(
      { message: "Thank you. Our team has received your enquiry." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to save contact enquiry:", error);
    return NextResponse.json(
      {
        message:
          "We couldn't save your enquiry right now. Please call or email our team.",
      },
      { status: 503 },
    );
  }
}
