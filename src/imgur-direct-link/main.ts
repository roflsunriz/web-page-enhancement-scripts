import { ImgurCopierApp } from './app';
import { createLogger } from '@/shared/logger';

function bootstrap() {
  const logger = createLogger('ImgurDirectLinkCopier');
  logger.info('Userscript bootstrapping...');
  const app = new ImgurCopierApp();
  app.start();
  logger.info('Bootstrap complete.');
}

bootstrap();