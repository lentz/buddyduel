import * as winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info['timestamp']} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
