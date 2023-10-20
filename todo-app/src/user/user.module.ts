import { Module, forwardRef } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports : [TypeOrmModule.forFeature([User]),forwardRef(() =>TodoModule)],
  providers: [UserResolver, UserService],
  exports : [UserService]
})
export class UserModule {}
