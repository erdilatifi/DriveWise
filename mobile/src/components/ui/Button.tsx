import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
  label?: string;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'default', 
  loading, 
  label, 
  className, 
  textClassName,
  icon,
  children,
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "flex-row items-center justify-center rounded-xl";
  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-surface",
    outline: "border-2 border-primary bg-transparent",
    ghost: "bg-transparent",
  };
  const sizeStyles = {
    default: "h-12 px-6",
    sm: "h-9 px-3",
    lg: "h-14 px-8",
  };
  const textStyles = {
    primary: "text-white font-bold",
    secondary: "text-text font-semibold",
    outline: "text-primary font-bold",
    ghost: "text-primary font-semibold",
  };

  return (
    <TouchableOpacity
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#3A86FF'} />
      ) : (
        <>
          {icon}
          {children ? children : (
            <Text className={clsx("text-base", textStyles[variant as keyof typeof textStyles], textClassName)}>{label}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
