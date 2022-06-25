import useSWR from 'swr';

function usePosts(userId, options) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/posts`, options);

  return {
    posts: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setPosts: mutate,
  };
}

export default usePosts;
