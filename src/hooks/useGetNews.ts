import UserData from 'types/userInfo';
import { useQuery } from 'react-query';
import axios from 'axios';
import userDataState from 'globalState/userDataState';
import { useRecoilValue } from 'recoil';
import News, { NewsDetail } from 'types/news';

const getNews = async (userData: UserData) => {
  const { data } = await axios.get<News[]>(
    `${process.env.REACT_APP_API_URL}/${userData.uuid}/news`,
    {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    },
  );
  return data;
};

const getNewsDetail = async (userData: UserData, newsId: string) => {
  const { data } = await axios.get<NewsDetail>(
    `${process.env.REACT_APP_API_URL}/${userData.uuid}/news/${newsId}`,
    {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    },
  );
  return data;
};

const useGetNews = () => {
  const userData = useRecoilValue(userDataState);
  const queryFn = () => getNews(userData);
  return useQuery<News[]>({
    queryKey: 'news',
    queryFn,
    cacheTime: 10000000,
    staleTime: 10000000,
  });
};

export const useGetNewsDetail = (newsId: string) => {
  const userData = useRecoilValue(userDataState);
  return getNewsDetail(userData, newsId);
};

export default useGetNews;
