"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBudgetModal } from "@/hooks/use-budget-modal";
import axios from "axios";
import toast from "react-hot-toast";
import useBudgetData from "@/hooks/use-budget-data";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getDate, setDate } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FieldCategory } from "./field-category";
import { FieldAmount } from "./field-amount";
import { FieldBudgetType } from "./field-budget-type";
import { FieldTimeFrame } from "./field-time-frame";
import { FieldStartDate } from "./field-start-date";

const defaultProps = z.object({
  type: z.enum(["CATEGORY", "OVERALL"]),
  amount: z.coerce.number().min(1),
  timeFrame: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  startDate: z.string().min(1),
});

const categorySchema = z.object({
  type: z.literal("CATEGORY"),
  categoryId: z.string().min(1),
});

const overallSchema = z.object({
  type: z.literal("OVERALL"),
});

const schemaCond = z.discriminatedUnion("type", [
  overallSchema,
  categorySchema,
]);

const formSchema = z.intersection(schemaCond, defaultProps);

export const FormBudget = () => {
  const { onClose, budget: initialData } = useBudgetModal();
  const { data: budgets } = useBudgetData();
  const router = useRouter();

  const hasOverall = budgets?.some((budget) => budget.type === "OVERALL");

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //@ts-ignore
    defaultValues: initialData
      ? {
          ...initialData,
          startDate:
            initialData.timeFrame === "DAILY"
              ? new Date().toDateString()
              : setDate(
                  new Date(),
                  getDate(new Date(initialData.startDate))
                ).toDateString(),
        }
      : {
          type: "CATEGORY",
          timeFrame: "MONTHLY",
          categoryId: "",
          amount: 0,
          startDate: new Date().toDateString(),
        },
  });

  const isLoading = form.formState.isSubmitting;
  const buttonText = initialData ? "Save Changes" : "Add Budget";
  const toastSuccess = initialData ? "Budget updated." : "Budget added.";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await axios.patch(`/api/budgets/${initialData.id}`, values);
      } else {
        await axios.post("/api/budgets", values);
      }
      toast.success(toastSuccess);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      router.refresh();
    } catch (error) {
      console.log("[CREATE_BUDGET_ERROR]", error);
      toast.error("An error has occured.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      toast.success("Budget has been deleted.");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("An error has occured.");
      console.log("[DELETE_BUDGET_ERROR]", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormControl>
                <FieldBudgetType
                  initialData={initialData}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  hasOverall={hasOverall}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("type") === "CATEGORY" && (
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full col-span-full sm:col-span-1">
                <FormLabel className="w-fit">Category</FormLabel>
                <FieldCategory
                  budgets={budgets}
                  selectedType="EXPENSE"
                  onChange={field.onChange}
                  value={field.value}
                  isLoading={isLoading}
                />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <FieldAmount
                  onValueChange={field.onChange}
                  value={field.value}
                  decimalScale={2}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeFrame"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Frame</FormLabel>
              <FieldTimeFrame
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  form.setValue("startDate", new Date().toDateString());
                }}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FieldStartDate
                timeFrame={form.watch("timeFrame")}
                value={field.value}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          {initialData && (
            <Button
              variant="outlineDestructive"
              disabled={isLoading}
              type="button"
              onClick={() => handleDelete(initialData.id)}
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="ml-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};