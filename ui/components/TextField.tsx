import { textFieldStyles } from "@/ui/components/textField/textFieldStyles";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled,
}: TextFieldProps) {
  return (
    <div className={textFieldStyles.wrapper}>
      <label className={textFieldStyles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          textFieldStyles.input.base,
          error ? textFieldStyles.input.error : textFieldStyles.input.default,
        ].join(" ")}
      />
      {error && <p className={textFieldStyles.errorMessage}>{error}</p>}
    </div>
  );
}
