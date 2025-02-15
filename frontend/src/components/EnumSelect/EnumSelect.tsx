import React from "react";
import {UseFormRegister} from "react-hook-form";
import styles from "../ModalEdit/ModalEdit.module.css";

interface EnumSelectProps<T> {
  enumObject: T;
  name: string;
  label?: string;
  value: T[keyof T] | "";
  onChange: (value: T[keyof T]) => void;
  register: UseFormRegister<any>;
  modal?: boolean
  defaultText: string
  className?: string
}

function EnumSelect<T extends object>({
                                        enumObject,
                                        name,
                                        label,
                                        value,
                                        onChange,
                                        register,
                                        defaultText,
                                        modal=true,
                                        className,
                                      }: EnumSelectProps<T>) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as T[keyof T];
    onChange(selectedValue);
  };

  return (
    <div>
      {modal && <label htmlFor={name} className={styles.label}>{label}</label>}
      <select {...register(name)} className={className} value={value ? String(value) : ""} onChange={handleChange}>
        <option value="" disabled>
          {defaultText}
        </option>
        {Object.values(enumObject).map((enumValue) => (
          <option key={enumValue} value={enumValue}>
            {String(enumValue)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EnumSelect;