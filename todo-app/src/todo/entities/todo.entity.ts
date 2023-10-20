import { ObjectType, Field} from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Todo {

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field(()=>String)
  todo: string;

  @Column()
  @Field()
  isDone:boolean;

  @ManyToOne(()=>User,(user)=>user.todo)
  @Field(()=>User)
  user : User;

  
}
