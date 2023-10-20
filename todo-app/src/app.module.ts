import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TodoModule } from './todo/todo.module';
import { User } from './user/entities/user.entity';
import { Todo } from './todo/entities/todo.entity';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';


@Module({
  imports: [UserModule,GraphQLModule.forRoot<ApolloDriverConfig>(
    {autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
    driver : ApolloDriver,
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  }
  ),
TypeOrmModule.forRoot(
  {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'rohan123',
    database: 'db2',
    entities: [User,Todo],
    synchronize: true,
  }
),
TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
