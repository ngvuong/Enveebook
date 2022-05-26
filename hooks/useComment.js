import useSWR from 'swr';

function useComment(postid) {
  const { data, error, mutate } = useSWR(`/api/posts/${postid}/comments`);

  return {
    comments: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setComment: mutate,
  };
}

export default useComment;
