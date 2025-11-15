// Sample chess puzzles data
const chessPuzzles = [
    {
        white: ["Ka1", "Pa2", "Pa3", "Ra4"],
        black: ["Qc3", "Rh7", "Bf7", "Pa7", "Pb7", "Pc7", "Kb8"],
        title: "Wo...run!",
        answer: "Kb1",
        toMove: "white"
    },
    {
        white: ["Kb1", "Pb2", "Pc3"],
        black: ["Qb5", "Bf6"],
        title: "No way!",
        answer: "B x c3",
        toMove: "black"
    },
    {
        white: ["Kb1"],
        black: ["Rc2", "Kb8", "Bc3", "Bb3", "Ne3"],
        title: "How is it possible?",
        answer: "Ba2#",
        toMove: "black"
    },
    {
        white: ["Kg1", "Pf2", "Pg2", "Ph2", "Rb1", "Qc2"],
        black: ["Pc7", "Pb7", "Pa7", "Kb8", "Qf8", "Nc6"],
        title: "What on earth!",
        answer: "Q x c6",
        toMove: "white"
    },
    {
        white: ["Kb1", "Qd2", "Rd1"],
        black: ["Pc7", "Pb7", "Pa7", "Kb8", "Rh8"],
        title: "Oh my golly!",
        answer: "Qd8+",
        toMove: "white"
    },
    {
        white: ["Ra1", "Pa2", "Rd1", "Pe3", "Pf2", "Kf1", "Nd5"],
        black: ["Kd8", "Pe7", "Pf7", "Pg7", "Qg4"],
        title: "Cheeses!",
        answer: "Nf6+",
        toMove: "white"
    },

];

let currentPuzzleIndex = 0;
let completedPuzzles = new Set();
let board = null;
let game = null;

// Convert piece notation to FEN square
function convertPieceToFEN(pieces) {
    // Create an empty 8x8 board
    const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));

    pieces.forEach(piece => {
        // Parse piece notation like "Ke1" or "Pa2"
        const pieceType = piece.charAt(0);
        const square = piece.substring(1);

        // Convert square notation (e.g., "e1") to array indices
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
        const rank = 8 - parseInt(square.charAt(1)); // 0-7 (flipped because FEN starts from rank 8)

        boardArray[rank][file] = pieceType;
    });

    return boardArray;
}

// Convert puzzle format to FEN
function puzzleToFEN(puzzle) {
    const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));

    // Place white pieces (uppercase)
    puzzle.white.forEach(piece => {
        const pieceType = piece.charAt(0);
        const square = piece.substring(1);
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
        const rank = 8 - parseInt(square.charAt(1));
        boardArray[rank][file] = pieceType;
    });

    // Place black pieces (lowercase)
    puzzle.black.forEach(piece => {
        const pieceType = piece.charAt(0).toLowerCase();
        const square = piece.substring(1);
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
        const rank = 8 - parseInt(square.charAt(1));
        boardArray[rank][file] = pieceType;
    });

    // Convert board array to FEN notation
    let fen = '';
    for (let rank = 0; rank < 8; rank++) {
        let emptyCount = 0;
        for (let file = 0; file < 8; file++) {
            if (boardArray[rank][file] === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                fen += boardArray[rank][file];
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        if (rank < 7) {
            fen += '/';
        }
    }

    // Add turn, castling, en passant, halfmove, and fullmove (simplified)
    fen += ' w KQkq - 0 1';

    return fen;
}

// Initialize the chess board
function initBoard(fen) {
    const config = {
        position: fen,
        draggable: false,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    if (board === null) {
        board = Chessboard('myBoard', config);
    } else {
        board.position(fen);
    }

    game = new Chess(fen);
}

// Load a puzzle
function loadPuzzle(index) {
    if (index >= chessPuzzles.length) {
        showCompletion();
        return;
    }

    const puzzle = chessPuzzles[index];
    const fen = puzzleToFEN(puzzle);

    document.getElementById('puzzleTitle').textContent = puzzle.title;
    document.getElementById('answerText').textContent = puzzle.answer;
    document.getElementById('answerSection').style.display = 'none';
    document.getElementById('showAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextPuzzleBtn').style.display = 'none';

    // Update turn indicator
    const turnIndicator = document.getElementById('turnIndicator');
    if (puzzle.toMove === 'white') {
        turnIndicator.textContent = 'White';
        turnIndicator.className = 'turn-indicator turn-white';
    } else {
        turnIndicator.textContent = 'Black';
        turnIndicator.className = 'turn-indicator turn-black';
    }

    initBoard(fen);
    updateProgress();
}

// Show answer
document.getElementById('showAnswerBtn').addEventListener('click', function () {
    document.getElementById('answerSection').style.display = 'block';
    document.getElementById('showAnswerBtn').style.display = 'none';
    document.getElementById('nextPuzzleBtn').style.display = 'inline-block';

    completedPuzzles.add(currentPuzzleIndex);
    updateProgress();
});

// Next puzzle
document.getElementById('nextPuzzleBtn').addEventListener('click', function () {
    if (currentPuzzleIndex < chessPuzzles.length - 1) {
        currentPuzzleIndex++;
        loadPuzzle(currentPuzzleIndex);
    } else {
        showCompletion();
    }
});

// Update progress bar
function updateProgress() {
    const progress = ((currentPuzzleIndex + 1) / chessPuzzles.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent =
        `Puzzle ${currentPuzzleIndex + 1} of ${chessPuzzles.length}`;
}

// Show completion screen
function showCompletion() {
    document.getElementById('puzzleSection').style.display = 'none';
    document.getElementById('completionSection').style.display = 'block';
}

// Unlock football puzzles
document.getElementById('unlockFootballBtn').addEventListener('click', function () {
    document.getElementById('completionSection').style.display = 'none';
    document.getElementById('footballSection').style.display = 'block';
    loadFootballPuzzle(0);
});

// Load first puzzle on page load
window.addEventListener('load', function () {
    loadPuzzle(0);
});

// ============== FOOTBALL PUZZLES ==============

// Football puzzles data - add your puzzle images and answers here
const footballPuzzles = [
    {
        image: "images/football1.png",
        title: "Tactical Challenge 1",
        answer: "This shows your white team kicking the ball up the pitch and scoring!"
    },
    {
        image: "images/football2.png",
        title: "Complex Formation",
        answer: "This shows your white team kicking the ball up the pitch and scoring!"
    },
    {
        image: "images/football3.png",
        title: "Field Positioning",
        answer: "The goalie and defenders are out of position! Kick the ball to the top left and score in the gap behind the goalie."
    },
    {
        image: "images/football4.png",
        title: "Ball Control Challenge",
        answer: "Dribble towards your opponent's goal (the one that they are defending) and then pass to number 70."
    },
    {
        image: "images/football5.jpg",
        title: "What can you do?",
        answer: "Mark player 70."
    }
];

let currentFootballIndex = 0;

// Load a football puzzle
function loadFootballPuzzle(index) {
    if (index >= footballPuzzles.length) {
        showFootballCompletion();
        return;
    }

    const puzzle = footballPuzzles[index];

    document.getElementById('footballTitle').textContent = puzzle.title;
    document.getElementById('footballImage').src = puzzle.image;
    document.getElementById('footballAnswerText').textContent = puzzle.answer;
    document.getElementById('footballAnswerSection').style.display = 'none';
    document.getElementById('showFootballAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextFootballPuzzleBtn').style.display = 'none';

    updateFootballProgress();
}

// Show football answer
document.getElementById('showFootballAnswerBtn').addEventListener('click', function () {
    document.getElementById('footballAnswerSection').style.display = 'block';
    document.getElementById('showFootballAnswerBtn').style.display = 'none';
    document.getElementById('nextFootballPuzzleBtn').style.display = 'inline-block';
});

// Next football puzzle
document.getElementById('nextFootballPuzzleBtn').addEventListener('click', function () {
    if (currentFootballIndex < footballPuzzles.length - 1) {
        currentFootballIndex++;
        loadFootballPuzzle(currentFootballIndex);
    } else {
        showFootballCompletion();
    }
});

// Update football progress bar
function updateFootballProgress() {
    const progress = ((currentFootballIndex + 1) / footballPuzzles.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent =
        `Football Puzzle ${currentFootballIndex + 1} of ${footballPuzzles.length}`;
}

// Show football completion
function showFootballCompletion() {
    document.getElementById('footballSection').innerHTML = `
        <div class="completion-container">
            <h2>Amazing!</h2>
            <p>You've completed all football puzzles!</p>
            <p class="final-message">You're a true CrazyMoves master!</p>
        </div>
    `;
}
