import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';

export type ApolloServerContext = {
  req: Request & { session: Session & { userId: number | null } };
  redis: Redis;
  res: Response;
};
