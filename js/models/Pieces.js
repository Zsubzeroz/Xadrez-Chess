import Piece from './Piece.js';

export class Pawn extends Piece {
    constructor(color, position) {
        super(color, position, 'pawn');
    }

    getPotentialMoves(board) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Move forward
        const forward = this.position + direction * 8;
        if (board.isEmpty(forward)) {
            moves.push(forward);
            // Double move from starting position
            const doubleForward = this.position + direction * 16;
            if (this.row === startRow && board.isEmpty(doubleForward)) {
                moves.push(doubleForward);
            }
        }

        // Captures
        const captureOffsets = [direction * 8 - 1, direction * 8 + 1];
        for (const offset of captureOffsets) {
            const target = this.position + offset;
            if (board.isWithinBounds(target) && Math.abs(board.getCol(target) - this.col) === 1) {
                const targetPiece = board.getPiece(target);
                if (targetPiece && targetPiece.color !== this.color) {
                    moves.push(target);
                }
                // En Passant check would go here (simplified for now)
                if (board.enPassantTarget === target) {
                    moves.push(target);
                }
            }
        }

        return moves;
    }
}

export class Knight extends Piece {
    constructor(color, position) {
        super(color, position, 'knight');
    }

    getPotentialMoves(board) {
        const moves = [];
        const offsets = [-17, -15, -10, -6, 6, 10, 15, 17];
        for (const offset of offsets) {
            const target = this.position + offset;
            if (board.isWithinBounds(target)) {
                const targetCol = board.getCol(target);
                const targetRow = board.getRow(target);
                // Check if L-shape is valid (column distance 1 and row distance 2, or vice versa)
                if (Math.abs(targetCol - this.col) <= 2 && Math.abs(targetRow - this.row) <= 2 &&
                    Math.abs(targetCol - this.col) + Math.abs(targetRow - this.row) === 3) {
                    const piece = board.getPiece(target);
                    if (!piece || piece.color !== this.color) {
                        moves.push(target);
                    }
                }
            }
        }
        return moves;
    }
}

export class Bishop extends Piece {
    constructor(color, position) {
        super(color, position, 'bishop');
    }

    getPotentialMoves(board) {
        return board.getSlidingMoves(this.position, [[-1, -1], [-1, 1], [1, -1], [1, 1]], this.color);
    }
}

export class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook');
    }

    getPotentialMoves(board) {
        return board.getSlidingMoves(this.position, [[-1, 0], [1, 0], [0, -1], [0, 1]], this.color);
    }
}

export class Queen extends Piece {
    constructor(color, position) {
        super(color, position, 'queen');
    }

    getPotentialMoves(board) {
        return board.getSlidingMoves(this.position, [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]], this.color);
    }
}

export class King extends Piece {
    constructor(color, position) {
        super(color, position, 'king');
    }

    getPotentialMoves(board) {
        const moves = [];
        const offsets = [-9, -8, -7, -1, 1, 7, 8, 9];
        for (const offset of offsets) {
            const target = this.position + offset;
            if (board.isWithinBounds(target) && Math.abs(board.getCol(target) - this.col) <= 1) {
                const piece = board.getPiece(target);
                if (!piece || piece.color !== this.color) {
                    moves.push(target);
                }
            }
        }
        // Castling logic would be added in Game/Board class to check for safety
        return moves;
    }
}
