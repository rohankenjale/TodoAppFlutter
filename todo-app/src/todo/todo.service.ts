import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {

  }
  
  async create(todoInput: CreateTodoInput, userId:string) {
    let todo = this.todoRepository.create(todoInput);
    todo.user = await this.userService.findOne(userId);
    return this.todoRepository.save(todo);
  }

  findAll(userid: User) {
    return this.todoRepository.find({ where: {user:userid} , relations : ["user"]});
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOne({ where: { id: id }, relations: ["user"] });
  }

  async update(id: string, updateTodoInput: UpdateTodoInput) {
    let newTodo = await this.todoRepository.findOne({ where: { id: id } })
    if (!newTodo) {
      throw Error("Todo item not found")
    }
    newTodo.todo = updateTodoInput.todo
    newTodo.isDone = updateTodoInput.isDone
    return this.todoRepository.save(newTodo)
  }

  async remove(id: string) {
    let todo = await this.todoRepository.findOne({ where: { id: id } })
    if (!todo) {
      throw Error("Todo not found")
    }
    await this.todoRepository.remove(todo)
    return todo
  }



  getUser(id: string) {
    return this.userService.findOne(id)
  }
}
