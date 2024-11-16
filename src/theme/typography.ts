export const FONT_FAMILY = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
  semiBold: 'Poppins-SemiBold',
  extraBold: 'Poppins-ExtraBold',
};

export const FONT_SIZE = {
  h1: 96,
  h2: 60,
  h3: 48,
  h4: 34,
  h5: 24,
  h6: 20,
  sub1: 16,
  sub2: 14,
  body1: 16,
  body2: 14,
  button: 14,
  caption: 12,
  overline: 10,
};

export const LINE_HEIGHT = {
  h1: 96,
  h2: 60,
  h3: 48,
  h4: 34,
  h5: 24,
  h6: 20,
  sub1: 24,
  sub2: 20,
  body1: 24,
  body2: 20,
  button: 20,
  caption: 20,
  overline: 20,
};

export const LETTER_SPACING = {
  h1: -1.5,
  h2: -0.5,
  h3: 0,
  h4: 0.25,
  h5: 0,
  h6: 0.15,
  sub1: 0.15,
  sub2: 0.1,
  body1: 0.5,
  body2: 0.25,
  button: 1.25,
  caption: 0.4,
  overline: 1.5,
};

export const TYPOGRAPHY = {
  h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.h1,
    letterSpacing: LETTER_SPACING.h1,
  },
  h2: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.h2,
    letterSpacing: LETTER_SPACING.h2,
  },
  h3: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.h3,
    letterSpacing: LETTER_SPACING.h3,
  },
  h4: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h4,
    letterSpacing: LETTER_SPACING.h4,
  },
  h5: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h5,
    letterSpacing: LETTER_SPACING.h5,
  },
  h6: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h6,
    letterSpacing: LETTER_SPACING.h6,
  },
  sub1: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sub1,
    letterSpacing: LETTER_SPACING.sub1,
  },
  sub2: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sub2,
    letterSpacing: LETTER_SPACING.sub2,
  },
  body1: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.body1,
    letterSpacing: LETTER_SPACING.body1,
  },
  body2: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.body2,
    letterSpacing: LETTER_SPACING.body2,
  },
  button: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.button,
    letterSpacing: LETTER_SPACING.button,
  },
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.caption,
    letterSpacing: LETTER_SPACING.caption,
  },
  overline: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.overline,
    letterSpacing: LETTER_SPACING.overline,
  },
} as const;
