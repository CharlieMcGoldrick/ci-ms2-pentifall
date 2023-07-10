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
    { name: "tPentomino", shape: tPentomino, color: colors[0] },
    { name: "uPentomino", shape: uPentomino, color: colors[1] },
    { name: "vPentomino", shape: vPentomino, color: colors[2] },
    { name: "wPentomino", shape: wPentomino, color: colors[3] },
    { name: "xPentomino", shape: xPentomino, color: colors[4] },
    { name: "yPentomino", shape: yPentomino, color: colors[5] },
    { name: "yPentominoFlipped", shape: yPentominoFlipped, color: colors[6] },
    { name: "zPentomino", shape: zPentomino, color: colors[7] },
    { name: "zPentominoFlipped", shape: zPentominoFlipped, color: colors[8] },
    { name: "fPentomino", shape: fPentomino, color: colors[9] },
    { name: "fPentominoFlipped", shape: fPentominoFlipped, color: colors[10] },
    { name: "iPentomino", shape: iPentomino, color: colors[11] },
    { name: "lPentomino", shape: lPentomino, color: colors[12] },
    { name: "lPentominoFlipped", shape: lPentominoFlipped, color: colors[13] },
    { name: "pPentomino", shape: pPentomino, color: colors[14] },
    { name: "pPentominoFlipped", shape: pPentominoFlipped, color: colors[15] }
];

export const pentominoWeights = {
    tPentomino: 1.2,
    uPentomino: 1.3,
    vPentomino: 1.1,
    wPentomino: 1,
    xPentomino: 0.2,
    yPentomino: 1.1,
    yPentominoFlipped: 1.1,
    zPentomino: 1.1,
    zPentominoFlipped: 1.1,
    fPentomino: 1,
    fPentominoFlipped: 1,
    iPentomino: 4.5,
    lPentomino: 1.3,
    lPentominoFlipped: 1.3,
    pPentomino: 1.4,
    pPentominoFlipped: 1.4
};

/**
 * Weighted selection function
 */
export function weightedPentominoSelection() {
    const weightedPentominoes = [];

    for (const pentomino of pentominoes) {
        const weight = pentominoWeights[pentomino.name] || 1;
        for (let i = 0; i < weight * 100; i++) {
            weightedPentominoes.push(pentomino);
        }
    }

    const randomIndex = Math.floor(Math.random() * weightedPentominoes.length);
    return weightedPentominoes[randomIndex];
}