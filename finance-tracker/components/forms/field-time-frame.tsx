import { cn } from "@/lib/utils";
import { Duration } from "@prisma/client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buttonVariants } from "@/components/ui/button";

interface FieldTimeFrame {
  value: Duration;
  onChange: (value: Duration) => void;
}

const transactionTypes = [
  {
    label: "Daily",
    value: "DAILY",
  },
  {
    label: "Weekly",
    value: "WEEKLY",
  },
  {
    label: "Monthly",
    value: "MONTHLY",
  },
  {
    label: "Yearly",
    value: "YEARLY",
  },
];

export const FieldTimeFrame = ({ value, onChange }: FieldTimeFrame) => {
  return (
    <RadioGroup
      onValueChange={(value: "DAILY" | "WEEKLY" | "MONTHLY") => {
        onChange(value);
      }}
      defaultValue={value}
      className="flex gap-4"
    >
      {transactionTypes.map((type) => (
        <div key={type.value} className="w-full">
          <RadioGroupItem hidden value={type.value} id={type.value} />
          <Label
            htmlFor={type.value}
            className={cn(
              "w-full cursor-pointer border border-input",
              buttonVariants({ variant: "outline" }),
              value === type.value && "ring-2 ring-ring ring-offset-2",
            )}
          >
            {type.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
