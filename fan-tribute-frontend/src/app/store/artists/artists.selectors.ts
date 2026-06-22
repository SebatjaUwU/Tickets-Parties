import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArtistsState, selectAllArtists } from './artists.reducer';

const selectArtistsState = createFeatureSelector<ArtistsState>('artists');
export const selectTop20Artists = createSelector(selectArtistsState, s => s.top20);
export const selectSelectedArtist = createSelector(selectArtistsState, s => s.selectedArtist);
export const selectArtistsLoading = createSelector(selectArtistsState, s => s.loading);
