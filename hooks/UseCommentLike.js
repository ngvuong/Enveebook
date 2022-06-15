import useSWR from 'swr';

function useCommentLike(postId, commentId, fallbackData) {
  const { data, error, mutate } = useSWR(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      fallbackData,
    }
  );

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default useCommentLike;
