import { DefaultMantineColor } from '@mantine/core';

export const colors = {
    black: '#14172a',
    white: '#fdfdff',
};

export const defaultMantineColors: ReadonlyArray<DefaultMantineColor> = [
    'dark',
    'gray',
    'red',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'green',
    'lime',
    'yellow',
    'orange',
    'teal',
] as const;

export type ColorType = keyof typeof colors;

export const getColorCode = (color: ColorType) => colors[color];
