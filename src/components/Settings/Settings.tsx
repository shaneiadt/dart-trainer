import Dialog from "../Dialog/Dialog";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSettingsState } from "../../features/settings/selectors";
import {
  toggleDisplayWelcomeMessage,
  toggleShowRemainingCheckoutValue,
  toggleSpeechRecognition,
  toggleVoiceover,
} from "../../features/settings/settingsSlice";
import { SettingsToggle } from "./SettingsToggle";

export interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: Readonly<SettingsProps>) => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(getSettingsState);

  const {
    showRemainingCheckoutValue,
    displayWelcomeMessage,
    isVoiceoverEnabled,
    isSpeechRecognitionEnabled,
  } = settingsState;

  return (
    <Dialog onClose={onClose} title="Checkout Trainer Settings">
      <ul className="list-none">
        <SettingsToggle
          id="voiceover"
          label="Voiceover"
          ariaLabel="Toggle Voiceover"
          checked={isVoiceoverEnabled}
          onChange={() => dispatch(toggleVoiceover())}
        />
        <SettingsToggle
          id="speech-recognition"
          label="Speech Recognition"
          ariaLabel="Toggle Speech Recognition"
          checked={isSpeechRecognitionEnabled}
          onChange={() => dispatch(toggleSpeechRecognition())}
        />
        <SettingsToggle
          id="show-remaining-checkout-value"
          label="Show remaining checkout value"
          ariaLabel="Toggle Show Remaining Checkout Value"
          checked={showRemainingCheckoutValue}
          onChange={() => dispatch(toggleShowRemainingCheckoutValue())}
        />
        <SettingsToggle
          id="display-welcome-message"
          label="Display welcome message"
          ariaLabel="Toggle Display Welcome Message"
          checked={displayWelcomeMessage}
          onChange={() => dispatch(toggleDisplayWelcomeMessage())}
        />
      </ul>
    </Dialog>
  );
};
