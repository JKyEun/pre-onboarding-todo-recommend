export type Todo = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoItemProps = {
  id: string;
  title: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export type TodoListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};
