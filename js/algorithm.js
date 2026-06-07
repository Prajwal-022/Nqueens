/* ============================================
   Algorithm Explanation Page
   ============================================ */

function renderAlgorithmPage() {
  return `
    <div class="algo-container page">
      <div class="page-header">
        <h1>The <span class="highlight">Backtracking</span> Algorithm</h1>
        <p>A deep dive into how the N-Queens problem is solved using recursive backtracking.</p>
      </div>

      <!-- Card 1: What is Backtracking -->
      <div class="content-card">
        <h2><span class="card-num">1</span> What is Backtracking?</h2>
        <p>
          Backtracking is a general algorithmic technique that considers searching every possible
          combination in order to solve a computational problem. It incrementally builds candidates
          to the solution and abandons a candidate ("backtracks") as soon as it determines that
          the candidate cannot possibly lead to a valid solution.
        </p>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-num">01</div>
            <h4>Choose</h4>
            <p>Make a choice and explore its consequences</p>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <h4>Constrain</h4>
            <p>Check if the choice violates any constraints</p>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <h4>Goal</h4>
            <p>If valid and complete, record the solution</p>
          </div>
          <div class="step-card">
            <div class="step-num">04</div>
            <h4>Backtrack</h4>
            <p>Undo the choice and try the next option</p>
          </div>
        </div>
      </div>

      <!-- Card 2: N-Queens Strategy -->
      <div class="content-card">
        <h2><span class="card-num">2</span> N-Queens Strategy</h2>
        <p>
          We solve the N-Queens problem by placing queens <strong>one row at a time</strong>.
          For each row, we try placing a queen in every column. Before placing, we check
          if the position is "safe" — meaning no previously placed queen can attack it.
        </p>
        <p class="mt-md">
          If we successfully place queens in all N rows, we've found a solution. If we reach
          a row where no column is safe, we <strong>backtrack</strong> — remove the queen from
          the previous row and try the next column there.
        </p>
        <ul class="mt-md">
          <li>Start from row 0 (the top row)</li>
          <li>Try each column left to right in the current row</li>
          <li>Check if placement is safe (no conflicts)</li>
          <li>If safe, place the queen and move to the next row</li>
          <li>If all columns in a row fail, backtrack to the previous row</li>
          <li>When row N is reached, a solution is found</li>
        </ul>
      </div>

      <!-- Card 3: The isSafe Function -->
      <div class="content-card">
        <h2><span class="card-num">3</span> The isSafe() Function</h2>
        <p>
          Before placing a queen, we must verify three conditions to ensure no existing queen
          can attack the new position. Since we place row by row, we only need to check
          rows <em>above</em> the current row:
        </p>
        <ul class="mt-md">
          <li><strong>Same Column Check:</strong> No queen exists in the same column in any row above</li>
          <li><strong>Upper-Left Diagonal:</strong> No queen on the diagonal going upper-left</li>
          <li><strong>Upper-Right Diagonal:</strong> No queen on the diagonal going upper-right</li>
        </ul>

        <div class="code-block mt-md">
          <span class="code-label">Pseudocode</span>
          <code><pre>
<span class="keyword">function</span> <span class="func-name">isSafe</span>(<span class="param">board, row, col, n</span>) {
    <span class="comment">// Check column above</span>
    <span class="keyword">for</span> (i = row - <span class="number">1</span>; i >= <span class="number">0</span>; i--)
        <span class="keyword">if</span> (board[i][col] == QUEEN) <span class="return-kw">return</span> <span class="bool">false</span>

    <span class="comment">// Check upper-left diagonal</span>
    <span class="keyword">for</span> (i = row-<span class="number">1</span>, j = col-<span class="number">1</span>; i >= <span class="number">0</span> && j >= <span class="number">0</span>; i--, j--)
        <span class="keyword">if</span> (board[i][j] == QUEEN) <span class="return-kw">return</span> <span class="bool">false</span>

    <span class="comment">// Check upper-right diagonal</span>
    <span class="keyword">for</span> (i = row-<span class="number">1</span>, j = col+<span class="number">1</span>; i >= <span class="number">0</span> && j < n; i--, j++)
        <span class="keyword">if</span> (board[i][j] == QUEEN) <span class="return-kw">return</span> <span class="bool">false</span>

    <span class="return-kw">return</span> <span class="bool">true</span>
}</pre></code>
        </div>
      </div>

      <!-- Card 4: Full Solve Algorithm -->
      <div class="content-card">
        <h2><span class="card-num">4</span> The Solve Function</h2>
        <p>
          The main recursive function attempts to place a queen in each row. When all N queens
          are placed (base case), the current board configuration is recorded as a solution.
        </p>

        <div class="code-block mt-md">
          <span class="code-label">Pseudocode</span>
          <code><pre>
<span class="keyword">function</span> <span class="func-name">solveNQueens</span>(<span class="param">board, row, n, solutions</span>) {
    <span class="comment">// Base case: all queens placed</span>
    <span class="keyword">if</span> (row == n) {
        solutions.<span class="func-name">push</span>(<span class="func-name">copy</span>(board))
        <span class="return-kw">return</span>
    }

    <span class="comment">// Try each column in this row</span>
    <span class="keyword">for</span> (col = <span class="number">0</span>; col < n; col++) {
        <span class="keyword">if</span> (<span class="func-name">isSafe</span>(board, row, col, n)) {
            board[row][col] = QUEEN    <span class="comment">// Place queen</span>

            <span class="func-name">solveNQueens</span>(board, row + <span class="number">1</span>, n, solutions)

            board[row][col] = EMPTY    <span class="comment">// Backtrack</span>
        }
    }
}</pre></code>
        </div>
      </div>

      <!-- Card 5: Key Insights -->
      <div class="content-card">
        <h2><span class="card-num">5</span> Key Insights</h2>
        <div class="steps-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <div class="step-card">
            <div class="step-num">♛</div>
            <h4>Pruning Power</h4>
            <p>Backtracking prunes the search tree dramatically. Instead of checking all N^N possibilities, it skips entire subtrees that are invalid.</p>
          </div>
          <div class="step-card">
            <div class="step-num">📈</div>
            <h4>Solution Count Growth</h4>
            <p>N=4 has 2 solutions, N=8 has 92 solutions, N=12 has 14,200 solutions — growth is roughly factorial.</p>
          </div>
          <div class="step-card">
            <div class="step-num">🔄</div>
            <h4>Symmetry</h4>
            <p>Many solutions are rotations or reflections of others. Advanced solvers exploit symmetry to reduce work by ~8x.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
