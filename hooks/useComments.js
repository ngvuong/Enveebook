import useSWR from 'swr';

function useComments(postId, options) {
  const { data, error, mutate } = useSWR(
    `/api/posts/${postId}/comments`,
    options
  );

  return {
    comments: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setComments: mutate,
  };
}

export default useComments;
