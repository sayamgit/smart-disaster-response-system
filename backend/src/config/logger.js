const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json, colorize, simple } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'disaster-response-api' },
  transports: [
    new transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? combine(colorize(), simple())
        : combine(timestamp(), json())
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add Elasticsearch transport in production
if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_NODE) {
  try {
    const { ElasticsearchTransport } = require('winston-elasticsearch');
    logger.add(new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_NODE },
      index: process.env.ELASTICSEARCH_INDEX || 'disaster-logs'
    }));
  } catch (e) {
    logger.warn('Elasticsearch transport not available');
  }
}

module.exports = logger;
