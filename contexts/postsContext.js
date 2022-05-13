import { createContext, useReducer, useContext } from 'react';

const PostContext = createContext([]);

function postReducer(state, action) {
  switch (action.type) {
    case 'FETCH_POSTS':
      return {
        ...state,
        posts: action.posts,
        isLoading: false,
      };
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false,
      };
    case 'RESET_POSTS':
      return {
        ...state,
        posts: [],
        isLoading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function PostProvider({ children }) {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
    isLoading: false,
  });

  const value = [state, dispatch];
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}

export { PostProvider, usePost };
