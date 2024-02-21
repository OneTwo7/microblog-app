import argon2 from 'argon2';
import { Resolver, Query, Arg, Int, Field, InputType, Mutation } from 'type-graphql';
import { User } from '../entities/User';

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  password: string;
}

@InputType()
class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => Int) id: number): Promise<User | null> {
    const user = await User.findOneBy({ id });
    return user;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  @Mutation(() => User)
  async register(@Arg('options') options: RegisterInput) {
    const user = User.create({
      ...options,
      password: await argon2.hash(options.password),
    });

    await user.save();

    return user;
  }
}
