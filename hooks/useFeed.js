import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

function useFeed(userid) {
  const { data, error, mutate } = useSWR(`/api/user/${userid}/feed`, fetcher);

  return {
    feed: data,
    isError: error,
    isLoading: !error && !data,
    setFeed: mutate,
  };
}

export default useFeed;
