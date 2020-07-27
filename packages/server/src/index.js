import killPortProcess from 'kill-port-process';
import { isDev } from '@c4/shared';
import config from '@root/config';
import app from '@root/app';

async function start() {
  // prevents nodemon from crashing when restarting because port was still in use
  function killAndRestart() {
    const delayedRestart = () => setTimeout(start, 10);
    killPortProcess.killPortProcess(config.PORT).finally(delayedRestart);
  }

  const instance = await app.start();
  if (isDev) {
    instance.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        killAndRestart();
      } else {
        console.error(err);
      }
    });
  }
}

start();
