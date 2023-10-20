import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

enum Priority { urgent, normal, low }

class CheckableTodoItem extends StatefulWidget {
  const CheckableTodoItem( {super.key,required this.text,required this.id,required this.isDone, required this.refresh});

  final String text;
  final String? id;
  final bool isDone;
  final void Function()? refresh;
  // final Priority priority;

  @override
  State<CheckableTodoItem> createState() => _CheckableTodoItemState();
}

class _CheckableTodoItemState extends State<CheckableTodoItem> {
  late bool _done = widget.isDone;

  void _setDone(bool? isChecked) {
    setState(() {
      _done = isChecked ?? false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // var icon = Icons.low_priority;

    // if (widget.priority == Priority.urgent) {
    //   icon = Icons.notifications_active;
    // }

    // if (widget.priority == Priority.normal) {
    //   icon = Icons.list;
    // }

    return Mutation(
      options:MutationOptions(
                document: gql(r""" mutation UpdateTodo( $id : String! , $isDone : Boolean!, $todo: String!) {
  updateTodo(updateTodoInput: {id: $id ,isDone : $isDone  , todo: $todo }) {
    isDone
  }
}""")
              ),
        builder:(runMutation, result) {
          if (result!.hasException) {
            print(result.exception.toString());
            return Text("error");
          }
          if (result.isLoading) {
            return CircularProgressIndicator();
          }
          return Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Checkbox(value: _done,
                   onChanged: (bool? isChecked) {
                      runMutation({
                        "id" : widget.id,
                        "todo": widget.text,
                        "isDone": !_done
                      });
                      
                      
                      // Future.delayed(const Duration(milliseconds: 500), () {
                          setState(() {
                            // widget.refresh!();
                            print(_done);
                            _done = isChecked ?? false;
                          // });
                          
                        });

                    }),
          const SizedBox(width: 6),
          // Icon(icon),
          const SizedBox(width: 12),
          Text(widget.text),
        ],
      );
        },
    );
  }
}
