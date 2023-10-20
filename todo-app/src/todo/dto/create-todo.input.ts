import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {

  @Field(()=>String)
  todo: string;

  @Field()
  isDone:boolean;

}
