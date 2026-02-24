import Dialog from "../Dialog/Dialog";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSettingsState } from "../../features/settings/selectors";
import { toggleShowRemainingCheckoutValue } from "../../features/settings/settingsSlice";

export interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: Readonly<SettingsProps>) => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(getSettingsState);

  const { showRemainingCheckoutValue } = settingsState;

  return (
    <Dialog onClose={onClose} title="Checkout Trainer Settings">
      <ul className="list-none">
        <li className="flex justify-center items-center mb-4">
          <label htmlFor="switch-component" className="mr-4">
            Show remaining checkout value
          </label>
          <div className="relative inline-block w-11 h-5">
            <input
              checked={showRemainingCheckoutValue}
              onChange={() => dispatch(toggleShowRemainingCheckoutValue())}
              id="switch-component"
              type="checkbox"
              className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor="switch-component"
              className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
              aria-label="Toggle trainer settings"
            ></label>
          </div>
        </li>
      </ul>
    </Dialog>
  );
};
