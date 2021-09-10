import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';

const localPubSub = (options: Record<string, unknown> | undefined) => new PubSub(options);

const redisPubSub = (options: Record<string, unknown> | undefined, redisOptions: RedisOptions | undefined) =>
  new RedisPubSub({
    ...options,
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions)
  });

export const createPubSub = (options: Record<string, unknown> | undefined = undefined, redisOptions?: RedisOptions): PubSub | RedisPubSub => {
  if (redisOptions) {
    return redisPubSub(options, redisOptions);
  }
  return localPubSub(options);
};
