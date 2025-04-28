import { format, compile } from './dist/index.mjs';

// Test configurations
const ITERATIONS = 100;
const TEST_DATE = new Date('2024-03-15T12:30:45Z');

// Test formats
const FORMATS = [
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'MMMM D, YYYY',
  'h:mm:ss a',
  'HH:mm:ss Z',
  { date: 'full', time: 'full' },
  { date: 'long', time: 'short' }
];

// Helper function to measure execution time
function measureExecutionTime(fn) {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  return Number(end - start) / 1_000_000; // Convert to milliseconds
}

// Run performance tests
console.log('Performance Test Results:');
console.log('=======================');
console.log(`Iterations per test: ${ITERATIONS}`);
console.log(`Test date: ${TEST_DATE.toISOString()}`);
console.log('\n');

FORMATS.forEach(testFormat => {
  const formatStr = typeof testFormat === 'string' ? testFormat : JSON.stringify(testFormat);
  const altFomat = compile(testFormat);
  
  // Warm up
  for (let i = 0; i < 1000; i++) {
    format(TEST_DATE, testFormat);
    altFomat(TEST_DATE);
  }

  // Measure performance for format function
  const formatTime = measureExecutionTime(() => {
    for (let i = 0; i < ITERATIONS; i++) {
      format(TEST_DATE, testFormat);
    }
  });

  // Measure performance for altFormat function
  const altFormatTime = measureExecutionTime(() => {
    for (let i = 0; i < ITERATIONS; i++) {
      altFomat(TEST_DATE);
    }
  });

  const formatAvgTime = formatTime / ITERATIONS;
  const altFormatAvgTime = altFormatTime / ITERATIONS;

  console.log(`Format mask: ${formatStr}`);
  console.log(`[ ] value: ${format(TEST_DATE, testFormat)}`);
  console.log(`[a] value: ${altFomat(TEST_DATE)}`);
  console.log(`[ ] time: ${formatTime.toFixed(2)}ms, Avg: ${formatAvgTime.toFixed(4)}ms`);
  console.log(`[a] time: ${altFormatTime.toFixed(2)}ms, Avg: ${altFormatAvgTime.toFixed(4)}ms`);
  console.log('-----------------------');
}); 