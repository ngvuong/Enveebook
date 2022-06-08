import useSWR from 'swr';

function useLike(postId, commentId) {
  const URL = commentId
    ? `/api/posts/${postId}/comments/${commentId}/like`
    : `/api/posts/${postId}/like`;

  const { data, error, mutate } = useSWR(URL);

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default useLike;
