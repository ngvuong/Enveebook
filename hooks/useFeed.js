import useSWR from 'swr';

function useFeed(userId, options) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/feed`, options);

  return {
    posts: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setFeed: mutate,
  };
}

export default useFeed;
