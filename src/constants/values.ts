export type SectorNumbers =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type BoardValues = Record<
  `S${SectorNumbers}` | `D${SectorNumbers}` | `T${SectorNumbers}` | "DB" | "SB",
  number
>;
export const BOARD_VALUES: BoardValues = {
  S1: 1,
  D1: 2,
  T1: 3,

  S2: 2,
  D2: 4,
  T2: 6,

  S3: 3,
  D3: 6,
  T3: 9,

  S4: 4,
  D4: 8,
  T4: 12,

  S5: 5,
  D5: 10,
  T5: 15,

  S6: 6,
  D6: 12,
  T6: 18,

  S7: 7,
  D7: 14,
  T7: 21,

  S8: 8,
  D8: 16,
  T8: 24,

  S9: 9,
  D9: 18,
  T9: 27,

  S10: 10,
  D10: 20,
  T10: 30,

  S11: 11,
  D11: 22,
  T11: 33,

  S12: 12,
  D12: 24,
  T12: 36,

  S13: 13,
  D13: 26,
  T13: 39,

  S14: 14,
  D14: 28,
  T14: 42,

  S15: 15,
  D15: 30,
  T15: 45,

  S16: 16,
  D16: 32,
  T16: 48,

  S17: 17,
  D17: 34,
  T17: 51,

  S18: 18,
  D18: 36,
  T18: 54,

  S19: 19,
  D19: 38,
  T19: 57,

  S20: 20,
  D20: 40,
  T20: 60,

  SB: 25,
  DB: 50,
};
