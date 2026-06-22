import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event, EventFilters, PaginatedResponse, TicketTier, EventStats } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/events`;

  private mapEvent(raw: any): Event {
    return {
      ...raw,
      startDate: raw.startDate ?? raw.date,
      isFeatured: raw.isFeatured ?? raw.featured ?? false,
      isInternational: raw.isInternational ?? false,
      genres: raw.genres ?? (raw.genre ? [raw.genre] : []),
      gallery: raw.gallery ?? [],
      totalCapacity: raw.totalCapacity ?? raw.capacity ?? 0,
      ticketsSold: raw.ticketsSold ?? 0,
      totalRevenue: raw.totalRevenue ?? 0,
      viewsCount: raw.viewsCount ?? 0,
      likesCount: raw.likesCount ?? 0,
      artists: raw.artists ?? [],
      tags: raw.tags ?? [],
      organizer: raw.organizer ?? null,
      venue: raw.venue
        ? (typeof raw.venue === 'string'
          ? { id: '', slug: '', name: raw.venue, address: raw.venue, city: raw.city ?? '', country: raw.country ?? '', capacity: raw.capacity ?? 0, images: [], amenities: [] }
          : raw.venue)
        : undefined,
    } as Event;
  }

  private mapTier(raw: any): TicketTier {
    const qty = (raw.quantityTotal ?? 0) - (raw.quantitySold ?? 0) - (raw.quantityReserved ?? 0);
    return {
      ...raw,
      price: Number(raw.price),
      type: raw.type ?? (raw.name?.toLowerCase() as any) ?? 'general',
      benefits: raw.benefits ?? [],
      quantityAvailable: qty >= 0 ? qty : 0,
      status: raw.isActive ? 'available' : 'sold',
    } as TicketTier;
  }

  getEvents(filters?: EventFilters): Observable<PaginatedResponse<Event>> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<Event>>(this.API, { params }).pipe(
      map(r => ({ ...r, data: (r.data as any[]).map(e => this.mapEvent(e)) }))
    );
  }

  getFeaturedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API}/featured`).pipe(
      map((events: any[]) => events.map(e => this.mapEvent(e)))
    );
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API}/upcoming`).pipe(
      map((events: any[]) => events.map(e => this.mapEvent(e)))
    );
  }

  getEventBySlug(slug: string): Observable<Event> {
    return this.http.get<Event>(`${this.API}/${slug}`).pipe(
      map((e: any) => this.mapEvent(e))
    );
  }

  getEventTicketTiers(eventId: string): Observable<TicketTier[]> {
    return this.http.get<TicketTier[]>(`${this.API}/${eventId}/tickets`).pipe(
      map((tiers: any[]) => tiers.map(t => this.mapTier(t)))
    );
  }

  getEventStats(eventId: string): Observable<EventStats> {
    return this.http.get<EventStats>(`${this.API}/${eventId}/stats`);
  }

  createEvent(data: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.API, data);
  }

  updateEvent(id: string, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.API}/${id}`, data);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  publishEvent(id: string): Observable<Event> {
    return this.http.patch<Event>(`${this.API}/${id}/publish`, {});
  }

  toggleFavorite(eventId: string, isFavorite: boolean): Observable<unknown> {
    const url = `${environment.apiUrl}/users/me/favorites/${eventId}`;
    return isFavorite
      ? this.http.delete(url)
      : this.http.post(url, {});
  }
}
