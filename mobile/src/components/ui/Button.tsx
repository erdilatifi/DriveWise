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
  const baseStyles = "flex-row items-center justify-center rounded-full active:scale-[0.97] transition-transform gap-2";
  
  // Using specific colors to match new design system
  const variantStyles = {
    primary: "bg-indigo-600 shadow-md shadow-indigo-200",
    secondary: "bg-white border border-slate-200 shadow-sm",
    outline: "border border-indigo-600 bg-transparent",
    ghost: "bg-transparent",
  };
  
  const sizeStyles = {
    default: "h-12 px-6",
    sm: "h-9 px-4",
    lg: "h-14 px-8",
  };
  
  const textStyles = {
    primary: "text-white font-bold",
    secondary: "text-slate-900 font-semibold",
    outline: "text-indigo-600 font-bold",
    ghost: "text-indigo-600 font-semibold",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
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
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#4F46E5'} />
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
