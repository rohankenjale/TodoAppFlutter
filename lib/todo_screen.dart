import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'checkable_todo_item.dart';
// import 'package:flutter_internals/TodoScreen/todo_item.dart';

class Todo {
  const Todo(this.text,this.isDone, {this.id});

  final String text;
  final String? id;
  final bool isDone;
  // final Priority priority;
}

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() {
    return _TodoScreenState();
  }
}

class _TodoScreenState extends State<TodoScreen> {
  late void Function()? refresh;
  var todoText = TextEditingController();
  var _order = 'asc';
  List<Todo>  _todos = [];

  List<Todo> get _orderedTodos {
    final sortedTodos = List.of(_todos);
    sortedTodos.sort((a, b) {
      final bComesAfterA = a.text.compareTo(b.text);
      return _order == 'asc' ? bComesAfterA : -bComesAfterA;
    });
    return sortedTodos;
  }


  void _changeOrder() {
    setState(() {
      _order = _order == 'asc' ? 'desc' : 'asc';
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      floatingActionButton: Container(
        decoration: const BoxDecoration(
          color: Color.fromARGB(255, 228, 173, 7),
          shape: BoxShape.circle
        ),
        child: IconButton(onPressed: (){
          showModalBottomSheet(context: context, builder: (ctx){
            return Mutation(
              options: MutationOptions(document: gql(r""" mutation CreateTodo($todo: String!, $isDone : Boolean!, $userId : String!) {
                          createTodo(createTodoInput: { todo :$todo , isDone :$isDone} ,  userId : $userId) {
                            todo
                          }
                        } """)),
              builder:(runMutation, result) {
                if (result!.hasException) {
                  return const Text("error");
                }
                  
                if (result.isLoading) {
                  return const Text('Loading');
                }
                return Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children : [
                      TextField(
                      controller: todoText,
                      decoration: const InputDecoration(
                        label: Text("Todo")
                      ),
                     ),
                    //  DropdownButton(
                    //   items:Priority.values.map((value) => DropdownMenuItem(
                    //     value: value,
                    //     child: Text(value.name))).toList(),
                    //    onChanged: (value){
                    //     dropDownValue = value;
                    //  },
                    //  )
                    const SizedBox(height: 10,),
                    ElevatedButton.icon(
                        onPressed: () {
                        runMutation(<String,dynamic>{
                        "todo": todoText.text,
                        "isDone": false, 
                        "userId": "1b3e719d-7ea4-430f-84bd-3ddb687284de"
                      });
                          // setState(() {
                          //   _todos.add(Todo(todoText.text));
                          //   todoText.text = '';
                          // });
                          Navigator.pop(context);
                          Future.delayed(const Duration(milliseconds: 500), () {
                            setState(() {
                              refresh!();
                              _todos.add(Todo(todoText.text,false),);
                              todoText.text = '';
                            });
                            
                          });
                          
                          
                          
                        }, 
                        icon: const Icon(Icons.add),
                        label: const Text("ADD")
                      )
                  ]
                ),
              );
              },
               
            );
          });
        }, icon: const Icon(Icons.add)),
        ),
      appBar: AppBar(
         title: const Text("ToDo"),
         actions: [
          Align(
            alignment: Alignment.centerRight,
            child: TextButton.icon(
              onPressed: _changeOrder,
              icon: Icon(
                _order == 'asc' ? Icons.arrow_downward : Icons.arrow_upward,
              ),
              label: Text('Sort ${_order == 'asc' ? 'Descending' : 'Ascending'}'),
            ),
          ),
         ],
      ),
      body:Query(
      options: QueryOptions(
                    document: gql(""" query GetAllTodo {
                  getAllTodo(userid: "1b3e719d-7ea4-430f-84bd-3ddb687284de" ) {
                    id
                    todo
                    isDone
                  }
                } """), 
                    // variables: {
                    //   'userid': "1b3e719d-7ea4-430f-84bd-3ddb687284de",
                    // },
                  ),
      builder: (QueryResult result, { refetch,fetchMore }) {
                    if (result.hasException) {
                        return Text(result.exception.toString());
                    }
                
                    if (result.isLoading) {
                      return const Center(child: CircularProgressIndicator());
                    }

                     List? todoList = result.data?["getAllTodo"];
                
                    if (todoList == null) {
                      return const Text('No todos');
                    }
                    final List<Todo> newTodos = [];
                    for (var value in todoList) {
                      newTodos.add(Todo(value["todo"],value["isDone"] ,id : value["id"]));
                    }
                    _todos = newTodos;
                    refresh = refetch;

                return Mutation(
                          options: MutationOptions(
                            document: gql(r""" mutation RemoveTodo($removeTodoId: String!) {
                          removeTodo(id: $removeTodoId) {
                            todo
                          }
                        }""")
                                ),
                          builder: (RunMutation runMutation, QueryResult? result) {
                            if (result!.hasException) {
                              return const Text("error");
                            }
                    return SingleChildScrollView(
                        child: Column(
                              children: [
                                // for (final todo in _orderedTodos) TodoItem(todo.text, todo.priority),
                                for (final todo in _orderedTodos)
                                  
                                  Dismissible(
                                    onDismissed: (direction) {
                                      runMutation({
                                          "removeTodoId": todo.id
                                        });
                                        _todos.remove(todo);
                                      Future.delayed(const Duration(milliseconds: 500), () {
                                        setState(() {
                                          refresh!();
                                        });
                                      });
                                    },
                                    key:ObjectKey(todo),
                                    child: CheckableTodoItem(
                                      key: ObjectKey(todo), // ValueKey()
                                      text: todo.text,
                                      id: todo.id,
                                      isDone : todo.isDone,
                                      refresh: refresh,
                                    ),
                                  ),
                              ],
                            ),
                      );
                                },);
      },
    )
      // SingleChildScrollView(
      //   child: Column(
      //         children: [
      //           // for (final todo in _orderedTodos) TodoItem(todo.text, todo.priority),
      //           for (final todo in _orderedTodos)
      //             Dismissible(
      //               onDismissed: (direction) {
      //                 setState(() {
      //                   _todos.remove(todo);
      //                 });
      //               },
      //               key:ObjectKey(todo),
      //               child: CheckableTodoItem(
      //                 key: ObjectKey(todo), // ValueKey()
      //                 todo.text
      //               ),
      //             ),
      //         ],
      //       ),
      // ),
    );
  }
}
