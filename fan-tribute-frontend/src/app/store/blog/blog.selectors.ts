import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState } from './blog.reducer';

const selectBlogState = createFeatureSelector<BlogState>('blog');
export const selectAllPosts = createSelector(selectBlogState, s => s.posts);
export const selectFeaturedPosts = createSelector(selectBlogState, s => s.featuredPosts);
export const selectSelectedPost = createSelector(selectBlogState, s => s.selectedPost);
export const selectBlogLoading = createSelector(selectBlogState, s => s.loading);
export const selectBlogTotal = createSelector(selectBlogState, s => s.total);
