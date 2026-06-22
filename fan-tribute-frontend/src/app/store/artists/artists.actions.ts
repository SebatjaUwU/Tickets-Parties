import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Artist } from '../../shared/models';

export const ArtistsActions = createActionGroup({
  source: 'Artists',
  events: {
    'Load Top20': emptyProps(),
    'Load Top20 Success': props<{ artists: Artist[] }>(),
    'Load Top20 Failure': props<{ error: string }>(),

    'Load Artist': props<{ slug: string }>(),
    'Load Artist Success': props<{ artist: Artist }>(),
    'Load Artist Failure': props<{ error: string }>(),

    'Toggle Follow': props<{ artistId: string }>(),
    'Toggle Follow Success': props<{ artistId: string; isFollowed: boolean }>(),
    'Toggle Follow Failure': props<{ error: string }>(),
  },
});
