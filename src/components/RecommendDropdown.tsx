import React, { useRef, useEffect, useState } from 'react';
import getRecommendList from '../api/search';
import { RecommendDropdownProps } from '../types/search';

function RecommendDropdown({
  inputText,
  recommendations,
  setRecommendations,
  handleRecommendationClick,
}: RecommendDropdownProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadMoreRecommendations = async () => {
    try {
      setLoading(true);
      const response = await getRecommendList({ q: inputText, page: page + 1, limit: 10 });
      const recommendedItems = response.data.result;
      setRecommendations(prevRecommendations => [...prevRecommendations, ...recommendedItems]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = dropdownRef.current!;
    if (scrollHeight - scrollTop === clientHeight) {
      setLoading(true);
      loadMoreRecommendations();
    }
  };

  useEffect(() => {
    dropdownRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      dropdownRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      {recommendations.map(el => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div key={el} className="dropdown-item" onClick={() => handleRecommendationClick(el)}>
          {el}
        </div>
      ))}
      <div className="dropdown-logo">
        {isLoading ? (
          <img className="dropdown-spinner" src="/images/loading.svg" alt="loading" />
        ) : (
          <img src="/images/more.svg" alt="more" />
        )}
      </div>
    </div>
  );
}

export default RecommendDropdown;
