import useSWR from 'swr';

function useComments(postId) {
  const { data, error, mutate } = useSWR(`/api/posts/${postId}/comments`);

  return {
    comments: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setComments: mutate,
  };
}

export default useComments;
