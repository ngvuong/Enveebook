import useSWR from 'swr';

function useComments(postId, fallbackData) {
  const { data, error, mutate } = useSWR(`/api/posts/${postId}/comments`, {
    fallbackData,
  });

  return {
    comments: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setComments: mutate,
  };
}

export default useComments;
