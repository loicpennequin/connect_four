import { AuthController } from './AuthController.js';
import { AuthService } from './AuthService.js';
import { makeClassInvoker } from 'awilix-express';
import { Router } from 'express';

const router = Router();

const api = makeClassInvoker(AuthController);

router.post('/login', api('login'));
router.get('/refresh_token', api('refreshToken'));
router.get('/logout', AuthService.ensureAuthenticated, api('logout'));

export const authRoutes = router;
