import { BoardKey, SectorNumbers } from "../../../constants";
import { Dartboard } from "../Dartboard";

export const getBoardKey = (
  val: SectorNumbers,
  multiplier: number
): BoardKey => {
  let key: BoardKey = `S${val}`;

  if (multiplier === 3) {
    key = `T${val}`;
  } else if (multiplier === 2) {
    key = `D${val}`;
  }

  return key;
};

export const getMultiplier = (ring: number) => {
  if (ring === 3) {
    return 3;
  }
  if (ring === 5) {
    return 2;
  }

  return 1;
};

export const getDartboardElement = () =>
  document.querySelector<Dartboard>("dartbot-dartboard");
