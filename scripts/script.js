const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", () => {
   cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("winner");
      cell.removeEventListener("click", gamestate);
      cell.addEventListener("click", gamestate);
   });
});

function checkWinner(board, highlight = false) {
   const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];

   for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
         if (highlight) {
            for (element of combination) {
               cells[element].classList.add("winner");
            }
         }
         return board[a];
      }
   }

   return board.includes("") ? null : "Draw";
}

function minimax(
   board,
   depth,
   isMaximizing,
   alpha = -Infinity,
   beta = Infinity
) {
   let winner = checkWinner(board);
   if (winner === "X") return 1;
   if (winner === "O") return -1;
   if (winner === "Draw") return 0;

   if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
         if (board[i] === "") {
            board[i] = "X";
            let score = minimax(board, depth + 1, false, alpha, beta);
            board[i] = "";
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
               break;
            }
         }
      }
      return bestScore;
   } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
         if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, depth + 1, true, alpha, beta);
            board[i] = "";
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, score);
            if (beta <= alpha) {
               break;
            }
         }
      }
      return bestScore;
   }
}

function findBestMove(board) {
   let bestScore = Infinity;
   let bestMove = null;

   for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
         board[i] = "O";
         let score = minimax(board, 0, true);
         board[i] = "";
         if (score < bestScore) {
            bestScore = score;
            bestMove = i;
         }
      }
   }
   return bestMove;
}

function tictactoeAI(board) {
   let bestMove = findBestMove(board);
   if (bestMove !== null) {
      cells[bestMove].textContent = "O";
      cells[bestMove].classList.add("filled");
   }
}

function enableEventListener() {
   cells.forEach((cell) => {
      cell.addEventListener("click", gamestate);
   });
}

function disableEventListener() {
   cells.forEach((cell) => {
      cell.removeEventListener("click", gamestate);
   });
}

function gamestate(e) {
   const cell = e.target;
   if (cell.textContent === "") {
      cell.textContent = "X";

      let board = Array.from(cells).map((cell) => cell.textContent);

      setTimeout(() => {
         let winner = checkWinner(board, true);
         if (winner) {
            if (winner === "Draw") {
               for (let cell of cells) {
                  cell.classList.add("winner");
               }
            }
            gameover();
            return 0;
         }
         tictactoeAI(board);
         board = Array.from(cells).map((cell) => cell.textContent);
         checkWinner(board, true) ? gameover() : null;
      }, 400);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   enableEventListener();
});
