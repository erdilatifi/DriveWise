import { TextInput, View, Text, TextInputProps } from 'react-native';
import { clsx } from 'clsx';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string; // Backwards compatibility
  containerClassName?: string;
  inputClassName?: string;
}

export const Input = ({ label, error, className, containerClassName, inputClassName, ...props }: InputProps) => {
  return (
    <View className={clsx("mb-4", containerClassName)}>
      {label && <Text className="mb-1.5 text-sm font-medium text-gray-900 dark:text-white">{label}</Text>}
      <TextInput
        className={clsx(
          "h-12 rounded-xl border bg-gray-50 px-4 text-base text-gray-900 dark:bg-gray-800 dark:text-white",
          error ? "border-red-500" : "border-gray-200 dark:border-gray-700",
          className,
          inputClassName
        )}
        placeholderTextColor="#9CA3AF"
        value={props.value !== undefined ? props.value : ''}
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
