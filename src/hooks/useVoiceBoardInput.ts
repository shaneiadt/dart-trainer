import { useEffect, useRef } from "react";
import { BoardKey } from "../constants/values";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
  length: number;
}

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: SpeechRecognitionResultLike;
    length: number;
  };
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructorLike {
  new (): BrowserSpeechRecognition;
}

interface SpeechGlobalLike {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
}

interface UseVoiceBoardInputParams {
  enabled: boolean;
  disabled: boolean;
  onBoardKey: (key: BoardKey) => void;
  onCommand?: (command: VoiceCommand) => void;
}

export type VoiceCommand =
  | "show_checkout"
  | "hide_checkout"
  | "toggle_checkout"
  | "next_checkout"
  | "start_game";

type ParsedVoiceInput =
  | { type: "command"; value: VoiceCommand }
  | { type: "board_key"; value: BoardKey }
  | null;

const NUMBER_WORD_TO_VALUE: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

const normalizeSpokenText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseVoiceCommand = (normalized: string): VoiceCommand | null => {
  if (
    /\b(start|start game|new game|begin)\b/.test(normalized) &&
    !/\b(double|single|triple|treble)\b/.test(normalized)
  ) {
    return "start_game";
  }

  if (
    /\b(next|next checkout|new checkout|another checkout)\b/.test(normalized)
  ) {
    return "next_checkout";
  }

  if (/\b(show checkout|show path)\b/.test(normalized)) {
    return "show_checkout";
  }

  if (/\b(hide checkout|hide path)\b/.test(normalized)) {
    return "hide_checkout";
  }

  if (/\b(toggle checkout|toggle path)\b/.test(normalized)) {
    return "toggle_checkout";
  }

  return null;
};

const getSpeechRecognitionConstructor = () => {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  const speechGlobal = globalThis as SpeechGlobalLike;
  return speechGlobal.SpeechRecognition || speechGlobal.webkitSpeechRecognition;
};

const parseSpokenBoardKeyFromNormalized = (
  normalized: string,
): BoardKey | null => {
  if (/\b(double bull|bullseye|inner bull)\b/.test(normalized)) {
    return "DB";
  }

  if (/\b(single bull|outer bull|bull)\b/.test(normalized)) {
    return "SB";
  }

  const ringMatch = /\b(single|double|triple|treble)\b/.exec(normalized);

  let ringPrefix: string;
  if (ringMatch?.[1] === "double") {
    ringPrefix = "D";
  } else if (ringMatch?.[1] === "triple" || ringMatch?.[1] === "treble") {
    ringPrefix = "T";
  } else {
    ringPrefix = "S";
  }

  const words = normalized.split(" ");
  let sector: number | null = null;

  for (const word of words) {
    if (/^\d+$/.test(word)) {
      const parsed = Number(word);
      if (parsed >= 1 && parsed <= 20) {
        sector = parsed;
        break;
      }
      continue;
    }

    const parsedWord = NUMBER_WORD_TO_VALUE[word];
    if (parsedWord) {
      sector = parsedWord;
      break;
    }
  }

  if (!sector) {
    return null;
  }

  return `${ringPrefix}${sector}` as BoardKey;
};

export const parseSpokenBoardKey = (transcript: string): BoardKey | null =>
  parseSpokenBoardKeyFromNormalized(normalizeSpokenText(transcript));

const getTranscriptFromEvent = (event: SpeechRecognitionEventLike): string => {
  const result = event.results[event.results.length - 1];
  if (!result?.length) {
    return "";
  }

  return result[0]?.transcript ?? "";
};

const parseVoiceInput = (transcript: string): ParsedVoiceInput => {
  const normalized = normalizeSpokenText(transcript);
  if (!normalized) {
    return null;
  }

  const command = parseVoiceCommand(normalized);
  if (command) {
    return { type: "command", value: command };
  }

  const boardKey = parseSpokenBoardKeyFromNormalized(normalized);
  if (boardKey) {
    return { type: "board_key", value: boardKey };
  }

  return null;
};

export const useVoiceBoardInput = ({
  enabled,
  disabled,
  onBoardKey,
  onCommand,
}: UseVoiceBoardInputParams) => {
  const shouldRestartRecognitionRef = useRef(false);
  const disabledRef = useRef(disabled);
  const onBoardKeyRef = useRef(onBoardKey);
  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    onBoardKeyRef.current = onBoardKey;
  }, [onBoardKey]);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    const RecognitionCtor = getSpeechRecognitionConstructor();
    if (!enabled || !RecognitionCtor) {
      return;
    }

    const recognition = new RecognitionCtor();
    shouldRestartRecognitionRef.current = true;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = getTranscriptFromEvent(event);
      if (!transcript) {
        return;
      }

      const parsedInput = parseVoiceInput(transcript);
      if (!parsedInput) {
        return;
      }

      if (parsedInput.type === "command") {
        onCommandRef.current?.(parsedInput.value);
        return;
      }

      if (disabledRef.current) {
        return;
      }

      onBoardKeyRef.current(parsedInput.value);
    };

    recognition.onerror = () => {
      if (!shouldRestartRecognitionRef.current) {
        return;
      }

      recognition.stop();
    };

    recognition.onend = () => {
      if (shouldRestartRecognitionRef.current) {
        recognition.start();
      }
    };

    recognition.start();

    return () => {
      shouldRestartRecognitionRef.current = false;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, [enabled]);
};
