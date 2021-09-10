import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import Redis from 'ioredis';

export interface PubSubRedisOptions {
  port?: number;
  host?: string;
  options?: Redis.RedisOptions;
}

const localPubSub = () => new PubSub();

const redisPubSub = (options: Record<string, unknown> | undefined, redisOptions: PubSubRedisOptions | undefined) =>
  new RedisPubSub({
    ...options,
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions)
  });

export const createPubSub = (options: Record<string, unknown> | undefined, redisOptions?: PubSubRedisOptions): PubSub | RedisPubSub => {
  if (options) {
    return redisPubSub(options, redisOptions);
  }
  return localPubSub();
};
