import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/get-current-user";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const { type, note, date, categoryId, amount, recurring, recurringInterval } =
    await req.json();

  if (!user) {
    return new NextResponse("User is required", { status: 401 });
  }
  if (!type) {
    return new NextResponse("Type is required", { status: 401 });
  }
  if (!date) {
    return new NextResponse("Date is required", { status: 401 });
  }
  if (!categoryId) {
    return new NextResponse("CategoryId is required", { status: 401 });
  }
  if (!amount) {
    return new NextResponse("Amount is required", { status: 401 });
  }

  const transaction = await prismadb.transaction.create({
    data: {
      userId: user.id,
      type,
      note,
      date,
      categoryId,
      amount,
      recurring,
      recurringInterval: recurring ? recurringInterval : null,
    },
  });

  return NextResponse.json(transaction);
}

export async function GET(_req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("User is required", { status: 401 });
  }

  const transactions = await prismadb.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(transactions);
}
