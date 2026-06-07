/* ============================================
   N-Queens Visualizer — Core Engine + UI
   ============================================ */

// ---- State ----
let vizState = {
  boardSize: 8,
  speed: 50,        // delay in ms
  isRunning: false,
  isStopped: false,
  solutions: [],
  currentSolution: -1,
  board: [],
  solvePromise: null,
  nodesExplored: 0,
};

// ---- Speed mapping: slider value (1-100) → delay (ms) ----
function getDelay(sliderValue) {
  // 1 = slowest (500ms), 100 = fastest (1ms)
  const minDelay = 1;
  const maxDelay = 500;
  return Math.round(maxDelay - (sliderValue / 100) * (maxDelay - minDelay));
}

// ---- Sleep helper ----
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Initialize empty board ----
function initBoard(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

// ---- Render the Visualizer Page ----
function renderVisualizerPage() {
  // Size buttons
  let sizeButtonsHTML = '';
  for (let i = 4; i <= 12; i++) {
    sizeButtonsHTML += `<button class="size-btn ${i === vizState.boardSize ? 'active' : ''}" 
      data-size="${i}" id="size-btn-${i}">${i}</button>`;
  }

  return `
    <div class="visualizer-container page">
      <!-- Left Panel: Controls -->
      <div class="left-panel" id="leftPanel">
        <div class="panel-section">
          <div class="section-label">Board Size (N)</div>
          <div class="size-buttons" id="sizeButtons">
            ${sizeButtonsHTML}
          </div>
        </div>

        <div class="panel-section">
          <div class="section-label">Animation Speed</div>
          <div class="speed-slider-wrap">
            <input type="range" id="speedSlider" min="1" max="100" value="${vizState.speed}">
            <div class="speed-labels">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <div class="section-label">Controls</div>
          <div class="action-buttons">
            <button class="btn btn-start" id="btnStart">▶ Start</button>
            <button class="btn btn-stop" id="btnStop" disabled>■ Stop</button>
            <button class="btn btn-reset" id="btnReset">↺ Reset</button>
          </div>
        </div>

        <div class="panel-section">
          <div class="section-label">Statistics</div>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value" id="statSolutions">0</div>
              <div class="stat-label">Solutions</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" id="statNodes">0</div>
              <div class="stat-label">Nodes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Chessboard -->
      <div class="center-panel" id="centerPanel">
        <div class="board-wrapper">
          <div class="chessboard" id="chessboard"></div>
        </div>
      </div>

      <!-- Right Panel: Solutions -->
      <div class="right-panel" id="rightPanel">
        <div class="solutions-header">
          <h3>Solutions Gallery</h3>
          <div class="solutions-nav">
            <button id="btnPrevSol" disabled>◀</button>
            <span class="sol-counter" id="solCounter">0 / 0</span>
            <button id="btnNextSol" disabled>▶</button>
          </div>
        </div>
        <div class="solutions-gallery" id="solutionsGallery">
          <div class="empty-state">
            <div class="empty-icon">♛</div>
            <div>No solutions yet</div>
            <div style="font-size: 0.8rem;">Click Start to begin solving</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- Build the chessboard grid ----
function buildChessboard() {
  const board = document.getElementById('chessboard');
  if (!board) return;

  const n = vizState.boardSize;
  const cellSize = calculateCellSize(n);

  board.style.gridTemplateColumns = `repeat(${n}, ${cellSize}px)`;
  board.style.gridTemplateRows = `repeat(${n}, ${cellSize}px)`;

  let html = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const isLight = (r + c) % 2 === 0;
      html += `<div class="cell ${isLight ? 'light' : 'dark'}" id="cell-${r}-${c}" 
        data-row="${r}" data-col="${c}"></div>`;
    }
  }
  board.innerHTML = html;
}

// Calculate cell size based on board size and viewport
function calculateCellSize(n) {
  const centerPanel = document.getElementById('centerPanel');
  if (!centerPanel) return 60;
  const available = Math.min(
    centerPanel.clientWidth - 48,
    centerPanel.clientHeight - 48,
    600
  );
  return Math.floor(available / n);
}

// ---- Place / remove queen on the visual board ----
function placeQueenVisual(row, col) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;
  cell.innerHTML = `<img class="queen-icon placing" src="${QUEEN_DATA_URL}" alt="Q">`;
}

function removeQueenVisual(row, col) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;
  const img = cell.querySelector('.queen-icon');
  if (img) {
    img.classList.remove('placing');
    img.classList.add('removing');
    setTimeout(() => {
      if (cell.contains(img)) cell.removeChild(img);
    }, 200);
  }
}

// ---- Highlight cells ----
function highlightCell(row, col, type) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;
  cell.classList.remove('highlight', 'trying', 'danger');
  if (type) cell.classList.add(type);
}

function clearHighlights() {
  document.querySelectorAll('.cell.highlight, .cell.trying, .cell.danger').forEach(c => {
    c.classList.remove('highlight', 'trying', 'danger');
  });
}

// ---- Update stats display ----
function updateStats() {
  const solEl = document.getElementById('statSolutions');
  const nodeEl = document.getElementById('statNodes');
  if (solEl) solEl.textContent = vizState.solutions.length;
  if (nodeEl) nodeEl.textContent = vizState.nodesExplored.toLocaleString();
}

function updateSolCounter() {
  const el = document.getElementById('solCounter');
  if (!el) return;
  const total = vizState.solutions.length;
  const current = vizState.currentSolution >= 0 ? vizState.currentSolution + 1 : 0;
  el.textContent = `${current} / ${total}`;
}

// ---- isSafe check ----
function isSafe(board, row, col, n) {
  // Column check
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 1) return false;
  }
  // Upper-left diagonal
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false;
  }
  // Upper-right diagonal
  for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 1) return false;
  }
  return true;
}

// ---- Async backtracking solver with visualization ----
async function solve(board, row, n) {
  if (vizState.isStopped) return;

  // Base case: all queens placed
  if (row === n) {
    // Record solution (column indices for each row)
    const solution = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] === 1) { solution.push(c); break; }
      }
    }
    vizState.solutions.push(solution);
    vizState.currentSolution = vizState.solutions.length - 1;
    updateStats();
    updateSolCounter();
    addMiniBoard(solution, vizState.solutions.length - 1);
    updateNavButtons();

    // Flash all queens green briefly
    for (let r = 0; r < n; r++) {
      highlightCell(r, solution[r], 'highlight');
    }
    await sleep(Math.max(getDelay(vizState.speed) * 3, 150));
    clearHighlights();
    return;
  }

  for (let col = 0; col < n; col++) {
    if (vizState.isStopped) return;

    vizState.nodesExplored++;
    updateStats();

    // Highlight the cell being tried
    highlightCell(row, col, 'trying');
    await sleep(getDelay(vizState.speed));

    if (isSafe(board, row, col, n)) {
      board[row][col] = 1;
      placeQueenVisual(row, col);
      highlightCell(row, col, 'highlight');
      await sleep(getDelay(vizState.speed));

      await solve(board, row + 1, n);

      if (vizState.isStopped) return;

      // Backtrack
      board[row][col] = 0;
      removeQueenVisual(row, col);
      highlightCell(row, col, 'danger');
      await sleep(Math.max(getDelay(vizState.speed) / 2, 1));
      highlightCell(row, col, null);
    } else {
      // Show conflict briefly
      highlightCell(row, col, 'danger');
      await sleep(Math.max(getDelay(vizState.speed) / 3, 1));
      highlightCell(row, col, null);
    }
  }
}

// ---- Add mini-board to solutions gallery ----
function addMiniBoard(solution, index) {
  const gallery = document.getElementById('solutionsGallery');
  if (!gallery) return;

  // Clear empty state on first solution
  const emptyState = gallery.querySelector('.empty-state');
  if (emptyState) emptyState.remove();

  const n = solution.length;
  const miniCellSize = Math.max(14, Math.floor(130 / n));

  const miniBoard = document.createElement('div');
  miniBoard.className = `mini-board ${index === vizState.currentSolution ? 'selected' : ''}`;
  miniBoard.style.gridTemplateColumns = `repeat(${n}, ${miniCellSize}px)`;
  miniBoard.style.gridTemplateRows = `repeat(${n}, ${miniCellSize}px)`;
  miniBoard.dataset.index = index;
  miniBoard.title = `Solution #${index + 1}`;

  let cellsHTML = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const isLight = (r + c) % 2 === 0;
      const hasQueen = solution[r] === c;
      cellsHTML += `<div class="mini-cell ${isLight ? 'light' : 'dark'}">
        ${hasQueen ? `<img class="mini-queen" src="${QUEEN_DATA_URL}" alt="Q">` : ''}
      </div>`;
    }
  }
  miniBoard.innerHTML = cellsHTML;

  // Click to display this solution on the main board
  miniBoard.addEventListener('click', () => {
    if (vizState.isRunning) return;
    vizState.currentSolution = index;
    displaySolution(solution);
    updateSolCounter();
    // Highlight selected
    document.querySelectorAll('.mini-board').forEach(b => b.classList.remove('selected'));
    miniBoard.classList.add('selected');
    updateNavButtons();
  });

  gallery.appendChild(miniBoard);
}

// ---- Display a specific solution on the main board ----
function displaySolution(solution) {
  const n = solution.length;
  clearHighlights();

  // Clear all queens
  document.querySelectorAll('.cell .queen-icon').forEach(img => img.remove());

  // Place queens for this solution
  for (let r = 0; r < n; r++) {
    const cell = document.getElementById(`cell-${r}-${solution[r]}`);
    if (cell) {
      cell.innerHTML = `<img class="queen-icon" src="${QUEEN_DATA_URL}" alt="Q">`;
    }
  }
}

// ---- Navigation buttons ----
function updateNavButtons() {
  const btnPrev = document.getElementById('btnPrevSol');
  const btnNext = document.getElementById('btnNextSol');
  if (!btnPrev || !btnNext) return;

  btnPrev.disabled = vizState.currentSolution <= 0;
  btnNext.disabled = vizState.currentSolution >= vizState.solutions.length - 1;
}

// ---- Initialize event listeners ----
function initVisualizerEvents() {
  // Size buttons
  const sizeButtons = document.getElementById('sizeButtons');
  if (sizeButtons) {
    sizeButtons.addEventListener('click', (e) => {
      const btn = e.target.closest('.size-btn');
      if (!btn || vizState.isRunning) return;
      const size = parseInt(btn.dataset.size);
      vizState.boardSize = size;
      resetVisualizer();
      // Update active state
      sizeButtons.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }

  // Speed slider
  const speedSlider = document.getElementById('speedSlider');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      vizState.speed = parseInt(e.target.value);
    });
  }

  // Start button
  const btnStart = document.getElementById('btnStart');
  if (btnStart) {
    btnStart.addEventListener('click', startSolving);
  }

  // Stop button
  const btnStop = document.getElementById('btnStop');
  if (btnStop) {
    btnStop.addEventListener('click', stopSolving);
  }

  // Reset button
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (vizState.isRunning) stopSolving();
      resetVisualizer();
    });
  }

  // Solution navigation
  const btnPrev = document.getElementById('btnPrevSol');
  const btnNext = document.getElementById('btnNextSol');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (vizState.currentSolution > 0 && !vizState.isRunning) {
        vizState.currentSolution--;
        displaySolution(vizState.solutions[vizState.currentSolution]);
        updateSolCounter();
        highlightSelectedMiniBoard();
        updateNavButtons();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (vizState.currentSolution < vizState.solutions.length - 1 && !vizState.isRunning) {
        vizState.currentSolution++;
        displaySolution(vizState.solutions[vizState.currentSolution]);
        updateSolCounter();
        highlightSelectedMiniBoard();
        updateNavButtons();
      }
    });
  }

  // Build the initial board
  buildChessboard();

  // Rebuild board on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (document.getElementById('chessboard') && !vizState.isRunning) {
        buildChessboard();
        if (vizState.currentSolution >= 0 && vizState.solutions.length > 0) {
          displaySolution(vizState.solutions[vizState.currentSolution]);
        }
      }
    }, 250);
  });
}

function highlightSelectedMiniBoard() {
  document.querySelectorAll('.mini-board').forEach((b, i) => {
    b.classList.toggle('selected', i === vizState.currentSolution);
  });
}

// ---- Start solving ----
async function startSolving() {
  if (vizState.isRunning) return;

  vizState.isRunning = true;
  vizState.isStopped = false;
  vizState.solutions = [];
  vizState.currentSolution = -1;
  vizState.nodesExplored = 0;

  // Clear gallery
  const gallery = document.getElementById('solutionsGallery');
  if (gallery) {
    gallery.innerHTML = '';
  }

  updateStats();
  updateSolCounter();
  updateNavButtons();
  toggleButtons(true);
  buildChessboard();

  const n = vizState.boardSize;
  vizState.board = initBoard(n);

  await solve(vizState.board, 0, n);

  vizState.isRunning = false;
  toggleButtons(false);

  // If solutions found, display the first one
  if (vizState.solutions.length > 0 && !vizState.isStopped) {
    vizState.currentSolution = 0;
    displaySolution(vizState.solutions[0]);
    updateSolCounter();
    highlightSelectedMiniBoard();
    updateNavButtons();
  }
}

// ---- Stop solving ----
function stopSolving() {
  vizState.isStopped = true;
  vizState.isRunning = false;
  toggleButtons(false);
}

// ---- Reset ----
function resetVisualizer() {
  vizState.solutions = [];
  vizState.currentSolution = -1;
  vizState.nodesExplored = 0;
  vizState.isRunning = false;
  vizState.isStopped = false;

  updateStats();
  updateSolCounter();
  updateNavButtons();
  buildChessboard();

  // Reset gallery
  const gallery = document.getElementById('solutionsGallery');
  if (gallery) {
    gallery.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♛</div>
        <div>No solutions yet</div>
        <div style="font-size: 0.8rem;">Click Start to begin solving</div>
      </div>`;
  }
}

// ---- Toggle button states ----
function toggleButtons(running) {
  const btnStart = document.getElementById('btnStart');
  const btnStop = document.getElementById('btnStop');
  const btnReset = document.getElementById('btnReset');
  const sizeButtons = document.querySelectorAll('.size-btn');

  if (btnStart) btnStart.disabled = running;
  if (btnStop) btnStop.disabled = !running;
  if (btnReset) btnReset.disabled = running;
  sizeButtons.forEach(b => b.disabled = running);
}
