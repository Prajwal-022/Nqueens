/* ============================================
   Home Page
   ============================================ */

const QUEEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#1a1816">
  <path d="M256 16L176 112l-80-48-48 192h416l-48-192-80 48L256 16zM48 416v48c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48H48zm0-32h416l-16-64H64l-16 64z"/>
</svg>`;

// Shared SVG data URL for queen icon
const QUEEN_DATA_URL = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#1a1816">
    <path d="M256 16L176 112l-80-48-48 192h416l-48-192-80 48L256 16zM48 416v48c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48H48zm0-32h416l-16-64H64l-16 64z"/>
  </svg>`
);

const QUEEN_WHITE_DATA_URL = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#ffffff">
    <path d="M256 16L176 112l-80-48-48 192h416l-48-192-80 48L256 16zM48 416v48c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48H48zm0-32h416l-16-64H64l-16 64z"/>
  </svg>`
);

function renderHomePage() {
  // 4x4 solution for demo board: queens at columns [1,3,0,2]
  const demoSolution = [1, 3, 0, 2];
  const size = 4;

  let demoBoardHTML = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isLight = (r + c) % 2 === 0;
      const hasQueen = demoSolution[r] === c;
      demoBoardHTML += `
        <div class="demo-cell ${isLight ? 'light' : 'dark'}">
          ${hasQueen ? `<img src="${QUEEN_DATA_URL}" alt="Queen" style="width:70%;height:70%">` : ''}
        </div>`;
    }
  }

  return `
    <div class="home-container page">
      <section class="hero-section">
        <div class="hero-text">
          <div class="subtitle">Algorithm Visualizer</div>
          <h1>Explore the <span class="highlight">N-Queens</span> Problem</h1>
          <p class="description">
            The N-Queens puzzle is the challenge of placing N  queens on an N×N chessboard
            so that no two queens threaten each other. This means no two queens share the same
            row, column, or diagonal. Watch the backtracking algorithm solve it step by step.
          </p>
          <a href="#/visualizer" class="btn-cta" id="btn-start-visualizing">
            Start Visualizing
            <span>→</span>
          </a>
        </div>
        <div class="hero-board">
          <div class="demo-board" style="grid-template-columns: repeat(${size}, 1fr);">
            ${demoBoardHTML}
          </div>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">What You'll Discover</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="card-icon">🔍</div>
            <h3>Real-Time Backtracking</h3>
            <p>Watch the algorithm explore, place queens, detect conflicts, and backtrack — all animated live on the board.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon">⚡</div>
            <h3>Adjustable Speed</h3>
            <p>Control the visualization speed from slow step-by-step exploration to lightning-fast solving.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon">📐</div>
            <h3>Variable Board Sizes</h3>
            <p>Solve for board sizes from 4×4 up to 12×12 and see how the number of solutions grows dramatically.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon">📊</div>
            <h3>Complexity Analysis</h3>
            <p>Understand the time and space complexity of the algorithm with detailed explanations and visual comparisons.</p>
          </div>
        </div>
      </section>
    </div>
  `;
}
