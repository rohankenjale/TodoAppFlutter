import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { FieldResolver } from 'type-graphql';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService,
    private readonly userService:UserService) {}

  @Mutation(() => Todo)
  async createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput,@Args('userId') userId: string) {
    console.log('added')
    return await  this.todoService.create(createTodoInput,userId);
  }

  @Query(() => [Todo], { name: 'getAllTodo' })
  async findAll(@Args('userid',{ type: () => String }) userid:string ) {
    console.log("hi")
    let user=await this.userService.findOne(userid);
    return this.todoService.findAll(user)
  }

  @Query(() => Todo, { name: 'getTodo' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.todoService.findOne(id);
  }

  @Mutation(() => Todo)
  async updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return await this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  async removeTodo(@Args('id', { type: () => String }) id: string) {
    console.log("deleted")
    return await this.todoService.remove(id);
  }

  @ResolveField(()=>User)
  async user(@Parent() todo:Todo){
    let newTodo= await this.todoService.findOne(todo.id);
    return newTodo.user;
  }
}

