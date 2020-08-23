const { exec } = require('child_process');

console.log('Starting build Script...');
console.log(`APP_NAME is ${process.env.APP_NAME}`);

function execWrap(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

switch (process.env.APP_NAME) {
  case 'client':
    execWrap('npm run build:client');
    break;
  case 'api':
    execWrap('npm run build:api');
    break;
  default:
    console.log('no build process for this app');
}
