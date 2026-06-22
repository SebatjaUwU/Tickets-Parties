import { createReducer, on } from '@ngrx/store';
import { BlogPost } from '../../shared/models';
import { BlogActions } from './blog.actions';

export interface BlogState {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  selectedPost: BlogPost | null;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  featuredPosts: [],
  selectedPost: null,
  total: 0,
  loading: false,
  error: null,
};

export const blogReducer = createReducer(
  initialState,
  on(BlogActions.loadPosts, state => ({ ...state, loading: true })),
  on(BlogActions.loadPostsSuccess, (state, { response }) => ({
    ...state,
    posts: response.data,
    total: response.total,
    loading: false,
  })),
  on(BlogActions.loadFeaturedPostsSuccess, (state, { posts }) => ({
    ...state,
    featuredPosts: posts,
    loading: false,
  })),
  on(BlogActions.loadPostSuccess, (state, { post }) => ({
    ...state,
    selectedPost: post,
    loading: false,
  })),
  on(BlogActions.likePostSuccess, (state, { postId }) => ({
    ...state,
    posts: state.posts.map(p =>
      p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p
    ),
  })),
);
