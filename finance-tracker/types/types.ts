import { getOverallBudget } from "@/actions/get-overall-budget";
import { Prisma, Transaction } from "@prisma/client";
import { LucideIcon } from "lucide-react";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Route = {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
};

export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true };
}>;

export type TransactionWithAmountAsNumber = Prettify<
  Omit<Transaction, "amount"> & {
    amount: number;
  }
>;

export type TransactionWithCategoryWithAmountAsNumber = Prettify<
  Omit<TransactionWithCategory, "amount"> & {
    amount: number;
  }
>;

export type ReceiptWithCategory = Prisma.ReceiptGetPayload<{
  include: { category: true };
}>;

export type CategoryWithReceiptCount = {
  id: string;
  title: string;
  color: string;
  type: "EXPENSE" | "INCOME";
  slug: string;
  _count: {
    receipts: number;
  };
};

export type OverallBudgetWithLimitAsNumber = Omit<
  Prisma.OverallBudgetGetPayload<{}>,
  "limit"
> & {
  limit: number;
};

export type CategoryBudgetWithLimitAsNumber = Omit<
  Prisma.CategoryBudgetGetPayload<{ include: { category: true } }>,
  "limit"
> & {
  limit: number;
};
