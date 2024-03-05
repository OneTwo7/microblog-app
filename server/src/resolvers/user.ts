import argon2 from 'argon2';
import { Resolver, Query, Arg, Int, Field, InputType, Mutation, ObjectType, Ctx } from 'type-graphql';
import { User } from '../entities/User';
import { ApolloServerContext } from '../types';
import { COOKIE_NAME } from '../constants';

const LOGIN_ERROR_MESSAGE = 'wrong user/password combination';

@InputType()
class LoginInput {
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

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: ApolloServerContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOneBy({ id: req.session.userId });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(@Arg('options') options: RegisterInput, @Ctx() { req }: ApolloServerContext): Promise<UserResponse> {
    const errors: FieldError[] = [];

    if (options.username.length <= 2) {
      errors.push({
        field: 'username',
        message: 'length must be greater than 2',
      });
    }

    if (options.username.includes('@')) {
      errors.push({
        field: 'username',
        message: "can't include a @ sign",
      });
    }

    if (!options.email.includes('@')) {
      errors.push({
        field: 'email',
        message: 'incorrect email',
      });
    }

    if (options.password.length <= 5) {
      errors.push({
        field: 'password',
        message: 'length must be greater than 5',
      });
    }

    if (errors.length) {
      return {
        errors,
      };
    }

    const user = User.create({
      ...options,
      password: await argon2.hash(options.password),
    });

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        if (err.detail.includes('username')) {
          errors.push({
            field: 'username',
            message: 'username has already been taken',
          });
        } else if (err.detail.includes('email')) {
          errors.push({
            field: 'email',
            message: 'user with this email is already registered',
          });
        }
      }

      if (errors.length) {
        return {
          errors,
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(@Arg('options') options: LoginInput, @Ctx() { req }: ApolloServerContext): Promise<UserResponse> {
    let user: User | null = null;

    if (options.usernameOrEmail.includes('@')) {
      user = await User.findOneBy({ email: options.usernameOrEmail });
    } else {
      user = await User.findOneBy({ username: options.usernameOrEmail });
    }

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: LOGIN_ERROR_MESSAGE,
          },
        ],
      };
    }

    const isPasswordValid = await argon2.verify(user.password, options.password);

    if (!isPasswordValid) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: LOGIN_ERROR_MESSAGE,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ApolloServerContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          console.error(err);
          resolve(false);
          return;
        }

        resolve(true);
      }),
    );
  }
}
