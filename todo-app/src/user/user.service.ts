import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository :Repository<User>,
    @Inject(forwardRef(() => TodoService))
    private todoService: TodoService,
    ){

    }
    create(userInput: CreateUserInput) {
        let user = this.userRepository.create(userInput);
        return this.userRepository.save(user);
      }


    async findAll():Promise<User[]>{
        return this.userRepository.find({relations:["todo"]})
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne({where: {id:id},relations:["todo"]});
    }
    
    async update(id: string, updateUserInput: UpdateUserInput) {
        let newUser = await this.userRepository.findOne({where:{id:id},relations:["todo"]});
        if (!newUser) {
          throw new Error("User not found");
        }
        newUser.name = updateUserInput.name;
        return this.userRepository.save(newUser)
        // let user = this.userRepository.create(updateUserInput)
        // user.id = id;
        // return this.userRepository.save(user)
    }

    async remove(@Arg("id") id: string) {
        const user = await this.userRepository.findOne({where:{id:id},relations:["todo"]});
        if (!user) {
          throw new Error("User not found");
        }
        user.todo.forEach(async value=> await this.todoService.remove(value["id"]))
        
        // for (let i = 0; i < user.todo.length; i++) {
        //   await this.todoService.remove(user.todo[i]["id"]);
        // }
        await this.userRepository.remove(user);
        return user;
    }
}
