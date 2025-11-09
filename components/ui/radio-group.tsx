import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              checked: child.props.value === value,
              onClick: () => onValueChange?.(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  checked?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, checked, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer transition-colors",
          checked
            ? "border-primary bg-primary/5"
            : "border-border hover:bg-accent",
          className
        )}
        role="radio"
        aria-checked={checked}
        tabIndex={0}
        {...props}
      >
        <div
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary ring-offset-background",
            checked && "bg-primary"
          )}
        >
          {checked && (
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
