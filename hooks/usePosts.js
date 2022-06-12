import useSWR from 'swr';

function usePosts(userId, fallbackData) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/posts`, {
    fallbackData,
  });

  return {
    posts: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setPosts: mutate,
  };
}

export default usePosts;
