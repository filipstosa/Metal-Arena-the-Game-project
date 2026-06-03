export const GRID_SIZE = 13.0625;

export const gridCells = (n) => {
    return n * GRID_SIZE;
}

// Rectangle collision check
export const isSpaceFree = (walls, x, y, size = GRID_SIZE) => {

    for (const wall of walls) {

        const collision =
            x < wall.x + wall.width &&
            x + size > wall.x &&
            y < wall.y + wall.height &&
            y + size > wall.y;

        if (collision) {
            return false;
        }
    }

    return true;
}