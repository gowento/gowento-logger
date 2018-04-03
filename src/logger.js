import { Logger } from 'heroku-logger';

// Export logger instance with sane defaults
const logger = new Logger({
  delimiter: '.',
});

export default logger;
