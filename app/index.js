#!/usr/bin/env node

import fs from 'fs';

const getLastNLines = (filePath, n, size = 128) => {
  const chunk = Buffer.alloc(size);
  const file = fs.openSync(filePath);
  const stats = fs.statSync(filePath);

  // Our output array. Since we are traversing backwards,
  // we will treat output as a stack and read it from end to start.
  const output = [];

  // If the file is smaller than the buffer size,
  // set position to 0 (don't start from negative).
  let position = Math.max(stats.size - size, 0);
  let totalLineCount = 0;
  let terminate = size;

  while (totalLineCount < n) {
    fs.readSync(file, chunk, { position });
    const word = chunk.toString().slice(0, terminate);
    const lines = word.split('\n');
    const lineCount = lines.length - 1;
    // When we get to the point where total
    // line count reaches/exceeds threshold,
    // make sure that we select only the target subset
    // of words for output.
    if (totalLineCount + lineCount >= n) {
      const remaining = lines.slice(-(n - totalLineCount)).join('\n');
      output.push(remaining);
      break;
    } else {
      totalLineCount += lineCount;
      output.push(word);
    }
    if (position === 0) break;
    // Prevent buffer overflow.
    terminate = Math.min(size, position);
    position = Math.max(position - size, 0);
  }
  console.log(output.reverse().join(''));
};

const main = async () => {
  try {
    const args = process.argv.slice(2);
    console.log(args);
    const [filePath, n, size] = args;
    getLastNLines(filePath, Number(n), size ? Number(size) : undefined);
  } catch (error) {
    console.log(error);
  }
};

main();
