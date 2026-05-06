import Game from './models/Game.js';
import UI from './ui/UI.js';

window.onload = () => {
    const game = new Game();
    game.start();
    
    const ui = new UI(game, 'container');
    ui.init();

    // Responsive adjustment
    const resizeBoard = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const size = Math.min(w, h) * 0.9;
        const container = document.getElementById('container');
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
    };

    window.onresize = resizeBoard;
    resizeBoard();
};
