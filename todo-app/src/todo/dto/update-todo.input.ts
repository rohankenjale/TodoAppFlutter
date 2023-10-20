import { CreateTodoInput } from './create-todo.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTodoInput {
  @Field()
  id: string;

  @Field(()=>String)
  todo: string;

  @Field()
  isDone:boolean;

}
