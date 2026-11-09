/** Single-word computer science and finance terms; stable per mesh vertex. */
const computing = [
  'LLM', 'WASM', 'LLVM', 'AST', 'SQL', 'HTTP', 'TCP', 'DNS',
  'TLS', 'CPU', 'GPU', 'SIMD', 'API', 'Compiler', 'Parser', 'Lexer',
  'Kernel', 'Thread', 'Coroutine', 'Closure', 'Recursion', 'Algorithm',
  'Graph', 'Trie', 'Heap', 'Stack', 'Queue', 'Hash', 'Cache', 'Buffer',
  'Memory', 'Pointer', 'Bytecode', 'Shader', 'Texture', 'Rasterization',
  'Tensor', 'Embedding', 'Attention', 'Transformer', 'Gradient', 'Inference',
  'Tokenization', 'Vector', 'Consensus', 'Raft', 'Replica', 'Sharding',
  'Index', 'Transaction', 'Deadlock', 'Semaphore', 'Mutex', 'Encryption',
  'Entropy', 'Compression', 'Serialization', 'Backpropagation', 'Neural', 'Binary',
] as const;

const finance = [
  'DCF', 'WACC', 'NPV', 'IRR', 'EBITDA', 'EBIT', 'CAPM', 'ROIC',
  'ROE', 'ROA', 'EPS', 'IPO', 'ETF', 'REIT', 'Equity', 'Bond',
  'Dividend', 'Yield', 'Coupon', 'Duration', 'Convexity', 'Volatility',
  'Beta', 'Alpha', 'Sharpe', 'Sortino', 'Arbitrage', 'Hedge', 'Derivative', 'Option',
  'Future', 'Swap', 'Forward', 'Delta', 'Gamma', 'Vega',
  'Theta', 'Rho', 'Premium', 'Strike', 'Leverage', 'Liquidity',
  'Solvency', 'Spread', 'Valuation', 'Discounting', 'Compounding', 'Accrual',
  'Amortization', 'Collateral', 'Margin', 'Capital', 'Revenue', 'Profit',
  'Cashflow', 'Portfolio', 'Rebalancing', 'Diversification', 'Correlation', 'Covariance',
] as const;

export const meshKeywords = computing.flatMap((word, index) => [word, finance[index]!]);
