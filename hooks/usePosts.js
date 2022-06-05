import useSWR from 'swr';

function usePosts(userId) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/posts`);

  return {
    posts: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setPosts: mutate,
  };
}

export default usePosts;
