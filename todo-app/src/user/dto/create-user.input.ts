import { Field, InputType } from "@nestjs/graphql";
import { Todo } from "src/todo/entities/todo.entity";



@InputType()
export class CreateUserInput {

  @Field(()=>String)
  name: string;
  
}