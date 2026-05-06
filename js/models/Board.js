import { Pawn, Knight, Bishop, Rook, Queen, King } from './Pieces.js';

export default class Board {
    constructor() {
        this.squares = new Array(64).fill(null);
        this.enPassantTarget = null;
    }

    init() {
        // Black pieces
        this.squares[0] = new Rook('black', 0);
        this.squares[1] = new Knight('black', 1);
        this.squares[2] = new Bishop('black', 2);
        this.squares[3] = new Queen('black', 3);
        this.squares[4] = new King('black', 4);
        this.squares[5] = new Bishop('black', 5);
        this.squares[6] = new Knight('black', 6);
        this.squares[7] = new Rook('black', 7);
        for (let i = 8; i < 16; i++) this.squares[i] = new Pawn('black', i);

        // White pieces
        for (let i = 48; i < 56; i++) this.squares[i] = new Pawn('white', i);
        this.squares[56] = new Rook('white', 56);
        this.squares[57] = new Knight('white', 57);
        this.squares[58] = new Bishop('white', 58);
        this.squares[59] = new Queen('white', 59);
        this.squares[60] = new King('white', 60);
        this.squares[61] = new Bishop('white', 61);
        this.squares[62] = new Knight('white', 62);
        this.squares[63] = new Rook('white', 63);
    }

    getPiece(index) {
        return this.squares[index];
    }

    isEmpty(index) {
        return this.isWithinBounds(index) && this.squares[index] === null;
    }

    isWithinBounds(index) {
        return index >= 0 && index < 64;
    }

    getCol(index) {
        return index % 8;
    }

    getRow(index) {
        return Math.floor(index / 8);
    }

    getSlidingMoves(position, directions, color) {
        const moves = [];
        const startRow = this.getRow(position);
        const startCol = this.getCol(position);

        for (const [dr, dc] of directions) {
            let r = startRow + dr;
            let c = startCol + dc;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const index = r * 8 + c;
                const piece = this.squares[index];

                if (piece === null) {
                    moves.push(index);
                } else {
                    if (piece.color !== color) {
                        moves.push(index);
                    }
                    break; // Blocked
                }
                r += dr;
                c += dc;
            }
        }
        return moves;
    }

    movePiece(from, to) {
        const piece = this.squares[from];
        this.squares[to] = piece;
        this.squares[from] = null;
        piece.position = to;
        piece.hasMoved = true;
    }

    clone() {
        const newBoard = new Board();
        newBoard.squares = this.squares.map(p => {
            if (!p) return null;
            const newP = Object.assign(Object.create(Object.getPrototypeOf(p)), p);
            return newP;
        });
        newBoard.enPassantTarget = this.enPassantTarget;
        return newBoard;
    }
}
