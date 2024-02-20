import { Resolver, Query } from 'type-graphql';
import { User } from '../entities/User';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find();
    return users;
  }
}
