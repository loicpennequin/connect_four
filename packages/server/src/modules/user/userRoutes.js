import { UserController } from './UserController';
import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';
import { AuthService } from '@root/modules/auth';

const router = Router();

const api = makeClassInvoker(UserController);

router.get('/', AuthService.ensureAuthenticated, api('findAll'));
router.post('/', api('create'));
router.get('/:id/games', api('findGamesByUserId'));

export const userRoutes = router;