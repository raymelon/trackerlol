"use client";

import { useOverallBudget } from "@/hooks/use-overall-budget-modal";
import { Settings2 } from "lucide-react";
import { OverallBudget } from "@/app/_trpc/client";

import { Button } from "@/components/ui/button";

interface OverallBudgetActionProps {
  budget: NonNullable<OverallBudget>["budget"];
}

export const OverallBudgetAction = ({ budget }: OverallBudgetActionProps) => {
  const { onOpen, setBudget } = useOverallBudget();

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => {
        setBudget(budget);
        onOpen();
      }}
    >
      <Settings2 className="h-4 w-4" />
      <div>
        Edit
        <span className="hidden sm:inline"> Budget</span>
      </div>
    </Button>
  );
};
