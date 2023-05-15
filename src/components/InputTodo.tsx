import React, { useEffect, useState } from 'react';
import { createTodo } from '../api/todo';
import useFocus from '../hooks/useFocus';
import useDebounce from '../hooks/useDebounce';
import RecommendDropdown from './RecommendDropdown';
import getRecommendList from '../api/search';
import { Todo } from '../types/todo';

function InputTodo({ setTodos }: { setTodos: React.Dispatch<React.SetStateAction<Todo[]>> }) {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { ref, setFocus } = useFocus();

  useEffect(() => {
    setFocus();
  }, [setFocus]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      console.log('API 호출');
      const response = await getRecommendList({ q: inputText, page: 1, limit: 10 });
      const recommendedItems = response.data.result;
      setRecommendations(recommendedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useDebounce(fetchRecommendations, 500);

  useEffect(() => {
    if (inputText === '') {
      setRecommendations([]);
    } else {
      debouncedFetch();
    }
  }, [inputText]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const trimmed = inputText.trim();
      if (!trimmed) {
        return alert('Please write something');
      }

      const newItem = { title: trimmed };
      const { data } = await createTodo(newItem);

      if (data) {
        setTodos((prev: Todo[]) => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setInputText('');
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = async (el: string) => {
    try {
      setIsLoading(true);
      setRecommendations([]);
      setInputText('');
      const { data } = await createTodo({ title: el });
      if (data) {
        setTodos(prev => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="search-div">
        <img className="search-icon" src="/images/search.svg" alt="search" />
      </div>
      <input
        className="input-text"
        placeholder="Add new todo..."
        ref={ref}
        value={inputText}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      {isLoading ? <img className="spinner" src="/images/loading.svg" alt="loading" /> : <span className="filler" />}
      {inputText.length > 0 && (
        <RecommendDropdown
          inputText={inputText}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          handleRecommendationClick={handleRecommendationClick}
        />
      )}
    </form>
  );
}

export default InputTodo;
