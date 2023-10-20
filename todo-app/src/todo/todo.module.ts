import { Module, forwardRef } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [TypeOrmModule.forFeature([Todo]),forwardRef(() =>UserModule)],
  providers: [TodoResolver, TodoService],
  exports : [TodoService]
})
export class TodoModule {}
