import { GameController } from './GameController';
import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import { AuthService } from '@root/modules/auth';

const router = Router();

const api = makeClassInvoker(GameController);

router.put('/replays', AuthService.ensureAuthenticated, api('generateGameState'));
router.get('/:id', AuthService.ensureAuthenticated, api('findById'));
router.get('/:id/messages', AuthService.ensureAuthenticated, api('findGameMessages'));

export const gameRoutes = router;
