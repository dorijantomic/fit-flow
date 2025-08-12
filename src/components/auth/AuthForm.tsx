"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Path } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Input } from "../ui/Input";

interface AuthFormProps<T extends z.ZodType<any, any, any>> {
  formSchema: T;
  formFields: {
    name: Path<z.infer<T>>;
    label: string;
    type: string;
    placeholder: string;
  }[];
  onSubmit: (values: z.infer<T>) => Promise<{ error?: string } | void>;
  submitButtonText: string;
  footerLinkHref: string;
  footerLinkText: string;
  footerText?: string;
}

export function AuthForm<T extends z.ZodType<any, any, any>>({
  formSchema,
  formFields,
  onSubmit,
  submitButtonText,
  footerLinkHref,
  footerLinkText,
  footerText,
}: AuthFormProps<T>) {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: formFields.reduce((acc, field) => {
      return { ...acc, [field.name]: "" };
    }, {}) as any,
  });

  const handleFormSubmit = (values: z.infer<T>) => {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="mx-auto max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {formFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: renderField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...renderField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Submitting..." : submitButtonText}
          </Button>
        </form>
      </Form>
      <p className="mt-4 text-center text-sm text-gray-500">
        {footerText}{" "}
        <Link href={footerLinkHref} className="font-medium text-blue-600 hover:text-blue-500">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}