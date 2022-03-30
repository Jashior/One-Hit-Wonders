import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Track } from '../models/Track';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  API_URL = environment.BASE_API_URL;

  constructor(private http: HttpClient) {}

  getAllTracks() {
    return this.http.get<Track[]>(`${this.API_URL}/getAll`);
  }

  getTracksByQuery(q: String) {
    return this.http.get<Track[]>(`${this.API_URL}/getTracsByQuery/${q}`);
  }

  getTrackById(id: String) {
    return this.http.get<Track>(`${this.API_URL}/getTrack/${id}`);
  }

  getTopTracks(n: number) {
    return this.http.get<Track[]>(`${this.API_URL}/getTopList/${n}`);
  }
}
