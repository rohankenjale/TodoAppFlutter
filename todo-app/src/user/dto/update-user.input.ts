import { Field, InputType } from "@nestjs/graphql";
import { Todo } from "src/todo/entities/todo.entity";

@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field(()=>String)
  name: string;
  
}