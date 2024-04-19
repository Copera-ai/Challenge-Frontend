import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { resolve } from "path";

const typeDefs = `#graphql
type Todo {
    id: ID!
    text: String!
    order: Int!
    completed: Boolean!
}

input TodosInput {
    completed: Boolean
    page: Int
    pageSize: Int
}

type Query {
    todos(input: TodosInput): [Todo]
}

type Mutation {
    ## Add a new todo
    addTodo (text: String!): Todo
    toggleTodo (id: ID!): Todo
    removeTodo (id: ID!): Todo
    updateTodo (id: ID!, text: String!, order: Int!): Todo
}
`;

(async () => {
  const db = await open({
    filename: resolve(__dirname, "todos.db"),
    driver: sqlite3.Database,
  });

  await db.exec(
    `CREATE TABLE IF NOT EXISTS todos ( id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, "order" INTEGER NOT NULL, completed INTEGER NULL)`,
  );

  const resolvers = {
    Query: {
      todos: async (_: any, { input }: { input: any }) => {
        const { page = 1, pageSize = 10, completed } = input;
        const offset = (page - 1) * pageSize;
        const where =
          completed === undefined
            ? ""
            : `WHERE completed = ${completed ? 1 : 0}`;
        const todos = await db.all(
          `SELECT * FROM todos ${where}  ORDER BY "order" ASC LIMIT ${pageSize} OFFSET ${offset}`,
        );
        return todos;
      },
    },
    Mutation: {
      addTodo: async (_: any, { text }: { text: string }) => {
        const lastRow = await db.get(
          'SELECT * FROM todos ORDER BY "order" DESC limit 1',
        );

        const nextOrder = lastRow ? lastRow.order + 65536 : 65536;

        const { lastID } = await db.run(
          `INSERT INTO todos (text, "order", completed) VALUES (?, ?, ?)`,
          text,
          nextOrder,
          0,
        );
        return { id: lastID, text, order: nextOrder, completed: false };
      },
      toggleTodo: async (_: any, { id }: { id: number }) => {
        const todo = await db.get("SELECT * FROM todos WHERE id = ?", id);
        await db.run(
          "UPDATE todos SET completed = ? WHERE id = ?",
          todo.completed ? 0 : 1,
          id,
        );
        return { ...todo, completed: !todo.completed };
      },
      updateTodo: async (
        _: any,
        { id, text, order }: { id: number; text: string; order: number },
      ) => {
        const todo = await db.get("SELECT * FROM todos WHERE id = ?", id);
        await db.run(
          `UPDATE todos SET text = ?, "order" = ? WHERE id = ?`,
          text,
          order,
          id,
        );
        return { ...todo, text, order };
      },
      removeTodo: async (_: any, { id }: { id: number }) => {
        const todo = await db.get("SELECT * FROM todos WHERE id = ?", id);
        await db.run("DELETE FROM todos WHERE id = ?", id);
        return todo;
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
