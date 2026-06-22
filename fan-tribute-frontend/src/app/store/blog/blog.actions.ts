import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BlogPost, PaginatedResponse } from '../../shared/models';

export const BlogActions = createActionGroup({
  source: 'Blog',
  events: {
    'Load Posts': props<{ page?: number; categoryId?: string; search?: string }>(),
    'Load Posts Success': props<{ response: PaginatedResponse<BlogPost> }>(),
    'Load Posts Failure': props<{ error: string }>(),

    'Load Featured Posts': emptyProps(),
    'Load Featured Posts Success': props<{ posts: BlogPost[] }>(),
    'Load Featured Posts Failure': props<{ error: string }>(),

    'Load Post': props<{ slug: string }>(),
    'Load Post Success': props<{ post: BlogPost }>(),
    'Load Post Failure': props<{ error: string }>(),

    'Like Post': props<{ postId: string }>(),
    'Like Post Success': props<{ postId: string }>(),
    'Like Post Failure': props<{ error: string }>(),
  },
});
