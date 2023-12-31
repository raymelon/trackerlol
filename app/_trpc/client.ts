import { AppRouter } from "@/trpc";
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>({});

type RouterOutput = inferRouterOutputs<AppRouter>;

export type TransactionWithCategory =
  RouterOutput["transaction"]["getAll"][number];
export type UserProfile = RouterOutput["profile"]["get"];
export type Categories = RouterOutput["category"]["get"];
export type CategoriesByCount = RouterOutput["category"]["getByCount"];
export type OverallBudget = RouterOutput["budget"]["overall"]["get"];
export type CategoriesBudgets = RouterOutput["budget"]["categories"]["getAll"];
export type Receipt = RouterOutput["receipt"]["get"]["all"][number];
