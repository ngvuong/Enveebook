import useSWR from 'swr';

function useComments(postid) {
  const { data, error, mutate } = useSWR(`/api/posts/${postid}/comments`);

  return {
    comments: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setComments: mutate,
  };
}

export default useComments;
