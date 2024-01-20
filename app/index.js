#!/usr/bin/env node

const main = async () => {
  try {
    const args = process.argv.slice(2);
    console.log(args);
  } catch (error) {
    console.log(error);
  }
};

main();
