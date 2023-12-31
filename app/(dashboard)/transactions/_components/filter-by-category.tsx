"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { Check, ChevronDown, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterByCategoryProps {
  income: Category[];
  expense: Category[];
  category: Category | undefined;
}

export const FilterByCategory = ({
  income,
  expense,
  category,
}: FilterByCategoryProps) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryIdParams = searchParams.get("categoryId");

  const onSelect = (value: string) => {
    const current = queryString.parse(searchParams.toString());
    const query = {
      ...current,
      categoryId: value.toLowerCase(),
    };

    const url = queryString.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    );

    setOpen(false);

    router.push(url);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "flex max-h-10 w-full justify-start gap-2",

            categoryIdParams &&
              "border-destructive text-destructive hover:text-destructive",
            category && "border-brand text-brand hover:text-brand",
          )}
          onClick={() => {
            setOpen(true);
          }}
        >
          <LayoutGrid className="h-4 w-4 opacity-50" />
          {category ? (
            <div className="flex min-h-[20px] items-center gap-2 leading-none">
              <span>{category?.emoji}</span>
              <span>{category?.title}</span>
            </div>
          ) : (
            "Category"
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandGroup heading="Expense">
            {expense.length === 0 && (
              <div className="py-2 text-center text-xs text-muted-foreground">
                No category
              </div>
            )}
            {expense.map((expenseCategory) => (
              <CommandItem
                value={expenseCategory.id}
                key={expenseCategory.id}
                onSelect={() => {
                  onSelect(expenseCategory.id);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    expenseCategory.id === category?.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {expenseCategory.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Income">
            {income.length === 0 && (
              <div className="py-2 text-center text-xs text-muted-foreground">
                No category
              </div>
            )}
            {income.map((incomeCategory) => (
              <CommandItem
                value={incomeCategory.id}
                key={incomeCategory.id}
                onSelect={() => {
                  onSelect(incomeCategory.id);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    incomeCategory.id === category?.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {incomeCategory.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
