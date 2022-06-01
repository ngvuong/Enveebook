import useSWR from 'swr';

function useLike(postid, commentid) {
  const URL = commentid
    ? `/api/posts/${postid}/comments/${commentid}/like`
    : `/api/posts/${postid}/like`;

  const { data, error, mutate } = useSWR(URL);

  return {
    likes: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setLike: mutate,
  };
}

export default useLike;
