import { withLog } from '@root/logger';
import { GameSerializer } from './GameSerializer';
import { MessageSerializer } from '@root/modules/message';
import errors, {
  wrapRequestDecorator as wrap
} from '@root/modules/core/ErrorFactory';

export class GameController {
         constructor({ gameService, messageService }) {
           this.gameService = gameService;
           this.messageService = messageService;
         }

         @withLog()
         @wrap()
         async findById(req, res) {
           const game = await this.gameService.findById(req.params.id);
           if (!game) throw errors.notFound();

           res.send(GameSerializer.toDTO(game));
         }

         @withLog()
         @wrap()
         async findGameMessages(req, res) {
           const messages = await this.messageService.findAll({
             filter: { game_id: req.params.id },
             order: [{ column: 'created_at', order: 'desc' }],
             offset: req.query.offset || 0,
             limit: req.query.limit || 30
           });

           res.send(messages.map(MessageSerializer.toDTO));
         }
       }
