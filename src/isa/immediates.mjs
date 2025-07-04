export const immediates = {
  // R: Does not have any immediate values,
  I: {
    [0b11111111111 << 20]: 0b11111111111,
    [0b1 << 31]: 0b111111111111111111111 << 11,
  },
  S: {
    [0b11111 << 7]: 0b11111,
    [0b111111 << 25]: 0b111111 << 5,
    [0b1 << 31]: 0b111111111111111111111 << 11,
  },
  B: {
    // Has value zero in the first position
    [0b1111 << 8]: 0b1111 << 1,
    [0b1 << 7]: 0b1 << 11,
    [0b111111 << 25]: 0b111111 << 5,
    [0b1 << 31]: 0b11111111111111111111 << 12,
  },
  U: {
    // Has value zero from 0 to 11 positions
    [0b11111111111111111111 << 12]: 0b11111111111111111111 << 12,
  },
  J: {
    // Has value zero in the first position
    [0b11111111 << 12]: 0b11111111 << 12,
    [0b1 << 20]: 0b1 << 11,
    [0b1111111111 << 21]: 0b1111111111 << 1,
    [0b1 << 31]: 0b111111111111 << 20,
  },
};
