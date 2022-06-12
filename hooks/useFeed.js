import useSWR from 'swr';

function useFeed(userId, fallbackData) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/feed`, {
    fallbackData,
  });

  return {
    posts: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setFeed: mutate,
  };
}

export default useFeed;
