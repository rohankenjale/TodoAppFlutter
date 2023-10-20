
import { Args, Mutation, Query ,Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Resolver()
export class UserResolver {
    constructor(private userService: UserService){}
    
    @Mutation(()=>User)
    createUser(@Args('createUserInput') createUserInput : CreateUserInput){
        return this.userService.create(createUserInput)
    }


    @Query(()=> [User] ,{name:"getAllUser"})
    getAllUser(){
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'getUser' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(()=> User)
    removeUser(@Args('id', { type: () => String }) id: string) {
        return this.userService.remove(id);
    }
}


