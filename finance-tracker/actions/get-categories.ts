import { redirect } from "next/navigation";
import { getCurrentUser } from "./get-current-user";
import prismadb from "@/lib/prismadb";

export const getCategories = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }
  const categories = await prismadb.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const expense = categories.filter((category) => category.type === "EXPENSE");
  const income = categories.filter((category) => category.type === "INCOME");

  return { income, expense, categories };
};
