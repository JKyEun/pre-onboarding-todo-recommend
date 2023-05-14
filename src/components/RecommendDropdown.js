import { useRef, useEffect, useState } from 'react';
import { getRecommendList } from '../api/search';

const RecommendDropdown = ({ inputText, recommendations, setRecommendations, handleRecommendationClick }) => {
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = dropdownRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      setLoading(true);
      loadMoreRecommendations();
    }
  };

  useEffect(() => {
    dropdownRef.current.addEventListener('scroll', handleScroll);
    return () => {
      if (dropdownRef.current) dropdownRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [dropdownRef.current]);

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

  return (
    <div className='dropdown' ref={dropdownRef}>
      {recommendations.map((el, idx) => (
        <div key={idx} className='dropdown-item' onClick={() => handleRecommendationClick(el)}>
          {el}
        </div>
      ))}
      <div className='dropdown-logo'>
        {isLoading ? (
          <img className='dropdown-spinner' src='/images/Ellipse 21.svg' alt='loading' />
        ) : (
          <img src='/images/Union.svg' alt='more' />
        )}
      </div>
    </div>
  );
};

export default RecommendDropdown;
