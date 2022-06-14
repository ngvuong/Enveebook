import useSWR from 'swr';

function usePostLike(postId, fallbackData) {
  const { data, error, mutate } = useSWR(`/api/posts/${postId}`, {
    fallbackData,
  });

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default usePostLike;
