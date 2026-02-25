export interface SettingsToggleProps {
  id: string;
  label: string;
  ariaLabel: string;
  checked: boolean;
  onChange: () => void;
}

export const SettingsToggle = ({
  id,
  label,
  ariaLabel,
  checked,
  onChange,
}: Readonly<SettingsToggleProps>) => {
  return (
    <li className="flex justify-center items-center mb-4">
      <label htmlFor={id} className="mr-4">
        {label}
      </label>
      <div className="relative inline-block w-11 h-5">
        <input
          checked={checked}
          onChange={onChange}
          id={id}
          type="checkbox"
          className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
        />
        <label
          htmlFor={id}
          className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
          aria-label={ariaLabel}
        ></label>
      </div>
    </li>
  );
};
