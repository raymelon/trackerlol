"use client";

import { HexColorPicker } from "react-colorful";
import { expenseColors, incomeColors } from "@/lib/colors";
import { Plus } from "lucide-react";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FieldColorProps {
  value: string;
  onChange: (value: string) => void;
  type: "EXPENSE" | "INCOME";
  categories: Category[] | undefined;
}

export const FieldColor = ({
  value,
  onChange,
  type,
  categories,
}: FieldColorProps) => {
  const colors = type === "EXPENSE" ? expenseColors : incomeColors;

  return (
    <div className="w-full grid grid-cols-10 gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            "w-full h-full aspect-square rounded-full",
            categories
              ? categories.some((category) => category.color === color.value) &&
                  "blur-sm cursor-not-allowed"
              : "blur-sm animate-pulse cursor-not-allowed"
          )}
          disabled={
            categories
              ? categories.some((category) => category.color === color.value)
              : true
          }
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
        />
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-full aspect-square bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500 p-1 rounded-full">
            <div className="bg-foreground text-background w-full h-full rounded-full grid place-items-center">
              <Plus strokeWidth={3} />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-fit">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};