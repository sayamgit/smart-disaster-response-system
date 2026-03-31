const redis = require('redis');
const logger = require('./logger');

let client;

async function connectRedis() {
  client = redis.createClient({
    socket: { host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT) || 6379 },
    password: process.env.REDIS_PASSWORD || undefined
  });
  client.on('error', err => logger.error('Redis client error:', err));
  await client.connect();
  logger.info('Redis connected successfully');
}

const get = async (key) => {
  try { return await client.get(key); } catch (e) { return null; }
};

const set = async (key, value, ttlSeconds = 300) => {
  try { await client.setEx(key, ttlSeconds, JSON.stringify(value)); } catch (e) {}
};

const del = async (key) => {
  try { await client.del(key); } catch (e) {}
};

const publish = async (channel, message) => {
  try { await client.publish(channel, JSON.stringify(message)); } catch (e) {}
};

module.exports = { connectRedis, get, set, del, publish };
