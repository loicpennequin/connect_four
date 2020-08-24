import { MessageController } from './MessageController';
import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import { AuthService } from '@root/modules/auth';

const router = Router();

const api = makeClassInvoker(MessageController);

router.get('/', AuthService.ensureAuthenticated, api('findAllFromLobby'));
router.post('/', AuthService.ensureAuthenticated, api('create'));

export const messageRoutes = router;
