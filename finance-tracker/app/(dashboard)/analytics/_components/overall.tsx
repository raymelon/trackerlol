import { getOverallLimit } from "@/actions/get-overall-limit";
import { formatCurrency } from "@/lib/utils";
import { getUserWithProfile } from "@/actions/get-user-with-profile";

import { Progress } from "@/components/ui/progress";
import { AddOverallBudget } from "@/components/add-overall-budget";

export const Overall = async () => {
  const budget = await getOverallLimit();
  const { profile } = await getUserWithProfile();

  return (
    <div className="col-span-full h-full w-full rounded-md border p-4 sm:col-span-6 md:col-span-3">
      {budget ? (
        <div className=" flex h-full flex-col justify-between">
          <h1 className="font-semibold">{budget.title}</h1>

          <div className="space-y-4">
            <div className="text-2xl font-semibold">
              {budget.percentage.toFixed(0)} %
            </div>

            <div className="space-y-2 leading-none text-muted-foreground">
              <div>
                Spent: {formatCurrency({ profile, amount: budget.totalSpent })}
              </div>
              <Progress
                className="h-3"
                value={budget.percentage > 100 ? 100 : budget.percentage}
              />
              <div>
                Target: {formatCurrency({ profile, amount: budget.limit })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-full w-full place-items-center">
          <AddOverallBudget />
        </div>
      )}
    </div>
  );
};
