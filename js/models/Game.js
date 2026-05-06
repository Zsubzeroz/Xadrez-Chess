import Board from './Board.js';
import { Queen } from './Pieces.js';

export default class Game {
    constructor() {
        this.board = new Board();
        this.turn = 'white';
        this.history = [];
        this.selectedSquare = null;
        this.legalMoves = [];
    }

    start() {
        this.board.init();
    }

    getLegalMoves(index) {
        const piece = this.board.getPiece(index);
        if (!piece || piece.color !== this.turn) return [];

        const potentialMoves = piece.getPotentialMoves(this.board);
        // Filter out moves that leave king in check
        return potentialMoves.filter(to => !this.moveLeavesKingInCheck(index, to));
    }

    moveLeavesKingInCheck(from, to) {
        const color = this.board.getPiece(from).color;
        const tempBoard = this.board.clone();
        tempBoard.movePiece(from, to);
        return this.isCheck(color, tempBoard);
    }

    isCheck(color, board = this.board) {
        const king = board.squares.find(p => p && p.type === 'king' && p.color === color);
        if (!king) return false;

        const opponentColor = color === 'white' ? 'black' : 'white';
        const opponentPieces = board.squares.filter(p => p && p.color === opponentColor);

        for (const piece of opponentPieces) {
            // Note: For check detection, we can use potential moves (pawn captures are slightly different)
            let moves = [];
            if (piece.type === 'pawn') {
                // Pawns attack diagonally
                const direction = piece.color === 'white' ? -1 : 1;
                const attacks = [piece.position + direction * 8 - 1, piece.position + direction * 8 + 1];
                moves = attacks.filter(idx => board.isWithinBounds(idx) && Math.abs(board.getCol(idx) - piece.col) === 1);
            } else {
                moves = piece.getPotentialMoves(board);
            }

            if (moves.includes(king.position)) return true;
        }
        return false;
    }

    makeMove(from, to) {
        const moves = this.getLegalMoves(from);
        if (!moves.includes(to)) return false;

        const piece = this.board.getPiece(from);
        
        // Handle Pawn Promotion
        if (piece.type === 'pawn') {
            const targetRow = this.board.getRow(to);
            if (targetRow === 0 || targetRow === 7) {
                // Simplified: Auto-promote to Queen
                this.board.squares[from] = new Queen(piece.color, from);
            }
        }

        this.board.movePiece(from, to);
        this.turn = this.turn === 'white' ? 'black' : 'white';
        return true;
    }

    isCheckmate(color) {
        if (!this.isCheck(color)) return false;

        const pieces = this.board.squares.filter(p => p && p.color === color);
        for (const piece of pieces) {
            if (this.getLegalMoves(piece.position).length > 0) return false;
        }
        return true;
    }
}
