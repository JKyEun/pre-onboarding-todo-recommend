import React from 'react';
import TodoItem from './TodoItem';
import { TodoListProps } from '../types/todo';

function TodoList({ todos, setTodos }: TodoListProps) {
  return todos.length ? (
    <ul>
      {todos.map(({ id, title }) => (
        <TodoItem key={id} id={id} title={title} setTodos={setTodos} />
      ))}
    </ul>
  ) : (
    <div className="empty-list">...</div>
  );
}
export default TodoList;
