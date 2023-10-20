import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:todo_app/todo_screen.dart';

void main() async {
  await initHiveForFlutter();

  final HttpLink httpLink = HttpLink(
    'https://2b54-103-158-43-33.ngrok-free.app/graphql',
  );

  ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: httpLink,
      cache: GraphQLCache(store: HiveStore()),
    ),
  );
  runApp(GraphQLProvider(
    client: client,
    child:  MaterialApp(
      theme: ThemeData(useMaterial3: true),
      title: 'GQL',
      home: const TodoScreen(),
  
    ),
  ));

 }

// void main() async {

//   runApp(MaterialApp(
//     theme: ThemeData(useMaterial3: true),
//     title: 'GQL',
//     home: Keys(),
  
//   ));

// }