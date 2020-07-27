import { GameController } from './GameController';
import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import { AuthService } from '@root/modules/auth';

const router = Router();

const api = makeClassInvoker(GameController);

export const gameRoutes = router;
