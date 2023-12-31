"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

import { Button } from "@/components/ui/button";
import { BudgetsCategory } from "./budgets-category";

export const Budgets = () => {
  const { data: budgets, isLoading } = trpc.budget.categories.getAll.useQuery(
    undefined,
    {
      staleTime: Infinity,
    },
  );

  if (isLoading) return null;

  return (
    <div className="col-span-full flex flex-col space-y-8 rounded-md border p-4 md:col-span-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Category Budgets</h1>
        <Link passHref href="/budgets">
          <Button variant="outline" className="shrink-0 gap-2">
            <Settings2 className="h-4 w-4" />
            <div>
              Manage <span className="hidden xl:inline"> Budgets</span>
            </div>
          </Button>
        </Link>
      </div>
      <div className="my-auto flex flex-wrap gap-4">
        {budgets?.length === 0 && (
          <div className="mx-auto my-auto w-full py-4 text-center text-muted-foreground">
            No category budget.
          </div>
        )}
        {budgets?.map((budget) => (
          <BudgetsCategory key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};
