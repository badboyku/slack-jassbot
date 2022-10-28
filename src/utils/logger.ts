import winston, {format} from 'winston';
import config from './config';

const {
  app: { logLevel },
} = config;
const { combine, prettyPrint, timestamp } = format;

const logger = winston.createLogger({
  level: logLevel,
  format: combine(timestamp(), prettyPrint({ depth: 8, colorize: true })),
  transports: [new winston.transports.Console()],
});

export default logger;
