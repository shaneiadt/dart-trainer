import { useRef } from "react";
import { getSettingsState } from "../../features/settings/selectors";
import { toggleDisplayWelcomeMessage } from "../../features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";

export const WelcomeDialog = () => {
  const dispatch = useAppDispatch();
  const { displayWelcomeMessage } = useAppSelector(getSettingsState);
  const ref = useRef(displayWelcomeMessage);

  if (!ref.current) {
    return null;
  }

  return (
    <Dialog title="Welcome To Your Darts Checkout Trainer" disableClickAway>
      <p className="mb-4 px-10">
        Practice your checkout routes by clicking on the dartboard. Click on the
        cog in the top right to customise your practice. Click the start button
        at the top when you're ready!
      </p>
      <Button
        onClick={() => {
          dispatch(toggleDisplayWelcomeMessage());
          ref.current = false;
        }}
        text="Got it!"
      />
    </Dialog>
  );
};
