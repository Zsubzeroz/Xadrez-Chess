export default class UI {
    constructor(game, containerId) {
        this.game = game;
        this.container = document.getElementById(containerId);
        this.symbols = {
            'black': {
                'king': '&#9818;',
                'queen': '&#9819;',
                'rook': '&#9820;',
                'bishop': '&#9821;',
                'knight': '&#9822;',
                'pawn': '&#9823;'
            },
            'white': {
                'king': '&#9812;',
                'queen': '&#9813;',
                'rook': '&#9814;',
                'bishop': '&#9815;',
                'knight': '&#9816;',
                'pawn': '&#9817;'
            }
        };
    }

    init() {
        this.renderBoard();
    }

    renderBoard() {
        this.container.innerHTML = '';
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.index = i;
            
            const row = Math.floor(i / 8);
            const col = i % 8;
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');

            const piece = this.game.board.getPiece(i);
            if (piece) {
                square.innerHTML = this.symbols[piece.color][piece.type];
                square.classList.add(piece.color);
                square.classList.add('occupied');
            }

            square.addEventListener('click', () => this.handleSquareClick(i));
            this.container.appendChild(square);
        }
        this.updateTurnIndicator();
    }

    updateTurnIndicator() {
        const turnSpan = document.getElementById('current-turn');
        if (turnSpan) {
            turnSpan.textContent = this.game.turn === 'white' ? 'Brancas' : 'Pretas';
        }
    }

    handleSquareClick(index) {
        const piece = this.game.board.getPiece(index);

        if (this.game.selectedSquare !== null) {
            // Attempt move
            const success = this.game.makeMove(this.game.selectedSquare, index);
            if (success) {
                this.game.selectedSquare = null;
                this.game.legalMoves = [];
                this.renderBoard();
                this.checkGameState();
            } else {
                // Change selection or deselect
                if (piece && piece.color === this.game.turn) {
                    this.selectSquare(index);
                } else {
                    this.deselect();
                }
            }
        } else if (piece && piece.color === this.game.turn) {
            this.selectSquare(index);
        }
    }

    selectSquare(index) {
        this.deselect();
        this.game.selectedSquare = index;
        this.game.legalMoves = this.game.getLegalMoves(index);
        
        const squares = this.container.querySelectorAll('.square');
        squares[index].classList.add('selected');
        
        this.game.legalMoves.forEach(moveIdx => {
            squares[moveIdx].classList.add('highlight');
        });
    }

    deselect() {
        this.game.selectedSquare = null;
        this.game.legalMoves = [];
        this.container.querySelectorAll('.square').forEach(sq => {
            sq.classList.remove('selected', 'highlight');
        });
    }

    checkGameState() {
        if (this.game.isCheckmate(this.game.turn)) {
            alert(`Checkmate! ${this.game.turn === 'white' ? 'Black' : 'White'} wins.`);
        } else if (this.game.isCheck(this.game.turn)) {
            console.log('Check!');
        }
    }
}
