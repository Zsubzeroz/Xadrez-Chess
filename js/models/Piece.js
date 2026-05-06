export default class Piece {
    constructor(color, position, type) {
        this.color = color; // 'white' or 'black'
        this.position = position; // 0-63
        this.type = type; // 'pawn', 'rook', etc.
        this.hasMoved = false;
    }

    /**
     * Returns an array of potential move indices.
     * Subclasses must implement this.
     */
    getPotentialMoves(board) {
        return [];
    }

    /**
     * Returns the column (0-7) of the current position.
     */
    get col() {
        return this.position % 8;
    }

    /**
     * Returns the row (0-7) of the current position.
     */
    get row() {
        return Math.floor(this.position / 8);
    }
}
