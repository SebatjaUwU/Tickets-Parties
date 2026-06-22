import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Artist } from '../../shared/models';
import { ArtistsActions } from './artists.actions';

export interface ArtistsState extends EntityState<Artist> {
  top20: Artist[];
  selectedArtist: Artist | null;
  loading: boolean;
  error: string | null;
}

const adapter = createEntityAdapter<Artist>();

const initialState: ArtistsState = adapter.getInitialState({
  top20: [],
  selectedArtist: null,
  loading: false,
  error: null,
});

export const artistsReducer = createReducer(
  initialState,
  on(ArtistsActions.loadTop20, state => ({ ...state, loading: true })),
  on(ArtistsActions.loadTop20Success, (state, { artists }) =>
    adapter.setAll(artists, { ...state, top20: artists, loading: false })),
  on(ArtistsActions.loadTop20Failure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ArtistsActions.loadArtistSuccess, (state, { artist }) => ({
    ...state,
    selectedArtist: artist,
  })),

  on(ArtistsActions.toggleFollowSuccess, (state, { artistId, isFollowed }) =>
    adapter.updateOne({ id: artistId, changes: { isFollowed } }, {
      ...state,
      top20: state.top20.map(a => a.id === artistId ? { ...a, isFollowed } : a),
    })
  ),
);

export const { selectAll: selectAllArtists } = adapter.getSelectors();
