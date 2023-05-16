import React, { useCallback, useState } from 'react';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import { deleteTodo } from '../api/todo';
import { TodoItemProps, Todo } from '../types/todo';

function TodoItem({ id, title, setTodos }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveTodo = useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteTodo(id);
      setIsLoading(false);
      setTodos((prev: Todo[]) => prev.filter((item: Todo) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  }, [id, setTodos]);

  return (
    <li className="item">
      <span>{title}</span>
      <div className="item-option">
        {!isLoading ? (
          <button type="button" onClick={handleRemoveTodo}>
            <FaTrash className="btn-trash" />
          </button>
        ) : (
          <FaSpinner className="spinner" />
        )}
      </div>
    </li>
  );
}

export default TodoItem;
