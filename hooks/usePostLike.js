import useSWR from 'swr';

function usePostLike(postId, options) {
  const { data, error, mutate } = useSWR(`/api/posts/${postId}`, options);

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default usePostLike;
