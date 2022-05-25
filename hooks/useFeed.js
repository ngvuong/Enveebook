import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((r) => r.json());

function useFeed(userId) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/feed`, fetcher);

  return {
    posts: data,
    isError: error,
    isLoading: !error && !data,
    setFeed: mutate,
  };
}

export default useFeed;
