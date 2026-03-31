const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

const activeIncidents = new client.Gauge({
  name: 'disaster_active_incidents_total',
  help: 'Number of active disaster incidents'
});

const volunteerCount = new client.Gauge({
  name: 'disaster_volunteers_available',
  help: 'Number of available volunteers'
});

const alertsTotal = new client.Counter({
  name: 'disaster_alerts_total',
  help: 'Total alerts issued',
  labelNames: ['severity', 'type']
});

const shelterOccupancy = new client.Gauge({
  name: 'disaster_shelter_occupancy_ratio',
  help: 'Shelter occupancy as ratio of capacity',
  labelNames: ['shelter_id']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(activeIncidents);
register.registerMetric(volunteerCount);
register.registerMetric(alertsTotal);
register.registerMetric(shelterOccupancy);

// Request duration middleware
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
};

module.exports = { register, metricsMiddleware, activeIncidents, volunteerCount, alertsTotal, shelterOccupancy };
