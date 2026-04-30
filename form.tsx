"use client"

import * as React from "react"
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface FormFieldContextValue {
  name: string
}

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export interface FormItemContextValue {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = { getFieldState: () => ({}), formState: {} } as any

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

export interface FormFieldProps extends React.ComponentProps<"div"> {
  name: string
}

export const FormField = ({
  control,
  name,
  ...props
}: FormFieldProps & { control?: any }) => {
  const fieldContext = React.useMemo(
    () => ({ name }),
    [name]
  )

  return (
    <FormFieldContext.Provider value={fieldContext}>
      <div {...props} />
    </FormFieldContext.Provider>
  )
}

export interface FormItemProps extends React.ComponentProps<"div"> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<typeof Label> {
  errors?: boolean
}

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FormLabelProps
>(({ className, ...props }, ref) => {
  const { errors } = props

  return (
    <Label
      ref={ref}
      className={cn(errors && "text-destructive", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

export interface FormControlProps
  extends React.ComponentPropsWithoutRef<typeof Input> {}

export const FormControl = React.forwardRef<
  React.ElementRef<typeof Input>,
  FormControlProps
>(({ ...props }, ref) => {
  const { error } = useFormField()

  return (
    <Input
      ref={ref}
      aria-describedby={
        undefined
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"