/* ============================================
   Time & Space Complexity Page
   ============================================ */

function renderComplexityPage() {
  // Known solution counts and approximate node counts
  const complexityData = [
    { n: 1,  solutions: 1,       nodes: 1,         time: '< 1ms' },
    { n: 2,  solutions: 0,       nodes: 2,         time: '< 1ms' },
    { n: 3,  solutions: 0,       nodes: 5,         time: '< 1ms' },
    { n: 4,  solutions: 2,       nodes: 16,        time: '< 1ms' },
    { n: 5,  solutions: 10,      nodes: 53,        time: '< 1ms' },
    { n: 6,  solutions: 4,       nodes: 152,       time: '< 1ms' },
    { n: 7,  solutions: 40,      nodes: 551,       time: '~1ms' },
    { n: 8,  solutions: 92,      nodes: 2056,      time: '~2ms' },
    { n: 9,  solutions: 352,     nodes: 8393,      time: '~8ms' },
    { n: 10, solutions: 724,     nodes: 35538,     time: '~30ms' },
    { n: 11, solutions: 2680,    nodes: 166925,    time: '~150ms' },
    { n: 12, solutions: 14200,   nodes: 856188,    time: '~800ms' },
  ];

  // Bar heights for visualization (log scale approximation)
  const maxNodes = 856188;
  const barHeights = complexityData.map(d => {
    if (d.nodes === 0) return 2;
    return Math.max(4, Math.round((Math.log(d.nodes + 1) / Math.log(maxNodes + 1)) * 180));
  });

  let tableRows = complexityData.map(d =>
    `<tr>
      <td class="mono">${d.n}</td>
      <td class="mono">${d.solutions.toLocaleString()}</td>
      <td class="mono">${d.nodes.toLocaleString()}</td>
      <td>${d.time}</td>
    </tr>`
  ).join('');

  let barChartHTML = complexityData.map((d, i) =>
    `<div class="bar-group">
      <div class="bar" style="height: ${barHeights[i]}px;">
        <div class="bar-tooltip">${d.nodes.toLocaleString()} nodes</div>
      </div>
      <div class="bar-label">N=${d.n}</div>
    </div>`
  ).join('');

  return `
    <div class="complexity-container page">
      <div class="page-header">
        <h1>Time & Space <span class="highlight">Complexity</span></h1>
        <p>Understanding how the algorithm's resource usage scales with board size.</p>
      </div>

      <!-- Time & Space cards -->
      <div class="complexity-grid">
        <div class="complexity-card">
          <h2>⏱️ Time Complexity</h2>
          <div class="big-o time">O(N!)</div>
          <p style="color: var(--clr-text-muted); line-height: 1.7; font-size: 0.92rem;">
            In the <strong>worst case</strong>, the backtracking algorithm explores up to
            <strong>N!</strong> (N factorial) nodes in the recursion tree.<br><br>
            For the first row, we have N choices. For the second row, at most N-1 choices
            (one column blocked), then N-2 for the third, and so on. This gives an upper
            bound of N × (N-1) × (N-2) × ... × 1 = <strong>N!</strong>.<br><br>
            However, diagonal pruning makes the <em>actual</em> running time significantly
            less than N!. Some analyses place it closer to <strong>O(N! / c^N)</strong>
            for some constant c, but O(N!) remains the standard upper bound.
          </p>
        </div>

        <div class="complexity-card">
          <h2>💾 Space Complexity</h2>
          <div class="big-o space">O(N²)</div>
          <p style="color: var(--clr-text-muted); line-height: 1.7; font-size: 0.92rem;">
            The space complexity has two components:<br><br>
            <strong>Board Storage: O(N²)</strong> — We maintain an N×N board to track queen
            positions. This can be optimized to O(N) by storing only the column index
            for each row.<br><br>
            <strong>Recursion Stack: O(N)</strong> — The maximum recursion depth is N
            (one call per row). Each stack frame uses O(1) space.<br><br>
            <strong>Solution Storage: O(S × N)</strong> — If we store all S solutions,
            each solution needs N values (one per row). For N=8, this means 92 × 8 = 736 values.
          </p>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="content-card">
        <h2 style="display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-size: 1.3rem;">
          📊 Performance by Board Size
        </h2>
        <div class="data-table-wrap mt-md">
          <table class="data-table">
            <thead>
              <tr>
                <th>Board (N)</th>
                <th>Solutions</th>
                <th>Nodes Explored</th>
                <th>Approx. Time</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bar Chart -->
      <div class="content-card">
        <h2 style="display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-size: 1.3rem;">
          📈 Nodes Explored (Log Scale)
        </h2>
        <div class="chart-container mt-md">
          <div class="chart-title">Recursion Tree Nodes vs Board Size</div>
          <div class="bar-chart">
            ${barChartHTML}
          </div>
        </div>
      </div>

      <!-- Why it matters -->
      <div class="content-card">
        <h2 style="display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-size: 1.3rem;">
          🧠 Why This Matters
        </h2>
        <p style="color: var(--clr-text-muted); line-height: 1.75; font-size: 0.95rem;">
          The N-Queens problem is a classic example of <strong>constraint satisfaction</strong>.
          Understanding its complexity helps in many areas:
        </p>
        <div class="steps-grid mt-md" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <div class="step-card">
            <div class="step-num">🎯</div>
            <h4>Interview Prep</h4>
            <p>N-Queens is one of the most common backtracking interview questions at top tech companies.</p>
          </div>
          <div class="step-card">
            <div class="step-num">🧩</div>
            <h4>CSP Problems</h4>
            <p>Techniques from N-Queens apply to Sudoku, graph coloring, scheduling, and resource allocation.</p>
          </div>
          <div class="step-card">
            <div class="step-num">⚙️</div>
            <h4>Optimization</h4>
            <p>Understanding factorial growth motivates optimizations like pruning, heuristics, and branch-and-bound.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
