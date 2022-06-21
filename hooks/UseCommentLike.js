import useSWR from 'swr';

function useCommentLike(postId, commentId, options) {
  const { data, error, mutate } = useSWR(
    `/api/posts/${postId}/comments/${commentId}`,
    options
  );

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default useCommentLike;
