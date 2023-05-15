import { useEffect, useState } from 'react';

import { createTodo } from '../api/todo';
import useFocus from '../hooks/useFocus';
import useDebounce from '../hooks/useDebounce';
import RecommendDropdown from './RecommendDropdown';
import { getRecommendList } from '../api/search';

const InputTodo = ({ setTodos }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { ref, setFocus } = useFocus();

  useEffect(() => {
    setFocus();
  }, [setFocus]);

  useEffect(() => {
    if (inputText === '') {
      setRecommendations([]);
    } else {
      debouncedFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

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

  const handleSubmit = async e => {
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
        return setTodos(prev => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setInputText('');
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = async el => {
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

  const handleInputChange = e => {
    const newText = e.target.value;
    setInputText(newText);
  };

  return (
    <>
      <form className='form-container' onSubmit={handleSubmit}>
        <div className='search-div'>
          <img className='search-icon' src='/images/search.svg' alt='search' />
        </div>
        <input
          className='input-text'
          placeholder='Add new todo...'
          ref={ref}
          value={inputText}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {isLoading ? (
          <img className='spinner' src='/images/loading.svg' alt='loading' />
        ) : (
          <span className='filler'></span>
        )}
        {inputText.length > 0 && (
          <RecommendDropdown
            inputText={inputText}
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            handleRecommendationClick={handleRecommendationClick}
          />
        )}
      </form>
    </>
  );
};

export default InputTodo;
