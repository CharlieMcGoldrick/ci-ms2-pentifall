// Pentominoes
export const tPentomino = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
];

export const uPentomino = [
    [1, 0, 1],
    [1, 1, 1]
];

export const vPentomino = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
];

export const wPentomino = [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
];

export const xPentomino = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
];

export const yPentomino = [
    [1, 0],
    [1, 1],
    [1, 0],
    [1, 0]
];

export const yPentominoFlipped = [
    [0, 1],
    [1, 1],
    [0, 1],
    [0, 1]
];

export const zPentomino = [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
];

export const zPentominoFlipped = [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0]
];

export const fPentomino = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0]
];

export const fPentominoFlipped = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 1, 0]
];

export const iPentomino = [
    [1],
    [1],
    [1],
    [1],
    [1]
];

export const lPentomino = [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 1]
];

export const lPentominoFlipped = [
    [0, 1],
    [0, 1],
    [0, 1],
    [1, 1]
];

export const pPentomino = [
    [1, 1],
    [1, 1],
    [1, 0]
];

export const pPentominoFlipped = [
    [1, 1],
    [1, 1],
    [0, 1]
];

// Pentomino Colours
// Main = main colour
// Dark = left and top edge colour
// Light = right and bottom edge colour
export const colors = [
    { main: "#333333", dark: "#005500", light: "#BDBDBD" },
    { main: "#2E2E2E", dark: "#005500", light: "#BDBDBD" },
    { main: "#292929", dark: "#005500", light: "#BDBDBD" },
    { main: "#242424", dark: "#005500", light: "#BDBDBD" },
    { main: "#1F1F1F", dark: "#005500", light: "#BDBDBD" },
    { main: "#1A1A1A", dark: "#005500", light: "#BDBDBD" },
    { main: "#151515", dark: "#005500", light: "#BDBDBD" },
    { main: "#101010", dark: "#005500", light: "#BDBDBD" },
    { main: "#0B0B0B", dark: "#005500", light: "#BDBDBD" },
    { main: "#060606", dark: "#005500", light: "#BDBDBD" },
    { main: "#202020", dark: "#005500", light: "#BDBDBD" },
    { main: "#252525", dark: "#005500", light: "#BDBDBD" },
    { main: "#2A2A2A", dark: "#005500", light: "#BDBDBD" },
    { main: "#2F2F2F", dark: "#005500", light: "#BDBDBD" },
    { main: "#343434", dark: "#005500", light: "#BDBDBD" },
    { main: "#393939", dark: "#005500", light: "#BDBDBD" }
];

// Assign color sets to the pentominoes
export const pentominoes = [
    { shape: tPentomino, color: colors[0] },
    { shape: uPentomino, color: colors[1] },
    { shape: vPentomino, color: colors[2] },
    { shape: wPentomino, color: colors[3] },
    { shape: xPentomino, color: colors[4] },
    { shape: yPentomino, color: colors[5] },
    { shape: yPentominoFlipped, color: colors[6] },
    { shape: zPentomino, color: colors[7] },
    { shape: zPentominoFlipped, color: colors[8] },
    { shape: fPentomino, color: colors[9] },
    { shape: fPentominoFlipped, color: colors[10] },
    { shape: iPentomino, color: colors[11] },
    { shape: lPentomino, color: colors[12] },
    { shape: lPentominoFlipped, color: colors[13] },
    { shape: pPentomino, color: colors[14] },
    { shape: pPentominoFlipped, color: colors[15] }
];