import { Field, ObjectType } from "@nestjs/graphql"
import { Todo } from "src/todo/entities/todo.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"


@ObjectType()
@Entity()
export class User {   
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string

    @Column()
    @Field()
    name : string
    
    @OneToMany(()=>Todo, (todo)=>todo.user)
    @Field(()=>[Todo],{nullable : true})
    todo: Todo[];
}