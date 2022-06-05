export const colors = {
    black: '#14172a',
    white: '#fdfdff'
}

export type ColorType = keyof typeof colors;

export const getColorCode = (color: ColorType) => colors[color];