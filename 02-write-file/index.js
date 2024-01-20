const readline = require('readline');
const path = require('path');
const fs = require('fs');

const writable = fs.createWriteStream(path.join(__dirname, '/output.txt'));
const rl = readline.createInterface(process.stdin, process.stdout);

console.log('Welcome to the console! (to exit enter "exit" or press ctrl+c)');
rl.on('line', (line) => {
  if (line === 'exit') rl.close();
  else writable.write(`${line}\n`);
});

rl.on('close', () => console.log('The process is complete, bye-bye!'));
