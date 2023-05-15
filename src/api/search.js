import apiRequest from './index';

const RESOURCE = '/search';

const getRecommendList = async data => {
  try {
    const response = await apiRequest.get(`${RESOURCE}`, { params: data });

    return response;
  } catch (error) {
    throw new Error('API getRecommendList error');
  }
};

export default getRecommendList;
