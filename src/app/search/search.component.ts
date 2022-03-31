import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  debounceTime,
  defaultIfEmpty,
  switchMap,
  map,
  catchError,
  tap,
} from 'rxjs/operators';
import { TrackService } from '../services/track.service';
import { Artist } from '../models/Artist';
import { Track } from '../models/Track';
import { ThrowStmt } from '@angular/compiler';

enum Display {
  SEARCH,
  TOP_LIST,
  GRAPH,
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  // Current Track
  track?: Track;
  trackId?: string;

  // Search vars
  listOfArtists: Artist[] = [];
  isLoading = false;
  searchChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Top 10
  topTracks?: Track[];

  // Display state
  Display = Display; // So HTML template can use the enum
  displayMode: Display | undefined; // Either 'SEARCH' or 'TOP_LIST'

  // Error handling
  errorMessage?: string;
  error: boolean = false;

  // Graph Data
  graphData?: any;

  constructor(private trackService: TrackService, private http: HttpClient) {}

  ngOnInit(): void {
    // HTTP request pipe inside switchMap so it can be canceled on immediate subsequent request
    // Handle errors inside here, if you handle errors outside on the main pipe then it will close the stream on error
    // We want the main pipe to stay open
    const getTracks = (name: string): Observable<any> => {
      if (!name) return of();
      return this.trackService
        .getTracksByQuery(name)
        .pipe(catchError((err) => this.handleError(err, 'Failed to search')));
    };

    // Mapping data to correct form for the drop down search menu
    const toList = (data: any[]): Artist[] =>
      data.map((t: any): Artist => ({ id: t['_id'], name: t['artist'] }));

    // Sets
    const setArtistsList = (data: any): void => {
      this.listOfArtists = data;
      this.isLoading = false;
    };

    // Observing the search subject
    const searchObs$: any = this.searchChange$
      .asObservable()
      .pipe(debounceTime(100))
      .pipe(switchMap(getTracks))
      .pipe(map(toList))
      .pipe(tap(setArtistsList))
      .subscribe();
  }

  onSelectArtist() {
    if (!this.trackId) return;
    this.clearError();

    const setCurrentTrack = (data: Track) => {
      this.isLoading = false;
      this.track = data;
      this.displayMode = Display.SEARCH;
    };

    this.trackService
      .getTrackById(this.trackId)
      .pipe(
        tap(setCurrentTrack),
        catchError((err: any) =>
          this.handleError(err, 'Failed to get artist information')
        )
      )
      .subscribe();
  }

  onSearch(value: string): void {
    if (value.length < 2) return;
    this.isLoading = true;
    this.searchChange$.next(value);
  }

  handleError(err: any, str: string): Observable<any> {
    this.displayError(str);
    return of();
  }

  displayError(msg: string) {
    this.error = true;
    this.isLoading = false;
    this.errorMessage = msg;
  }

  clearError() {
    this.error = false;
    this.errorMessage = undefined;
  }

  getTopList(n: number) {
    this.isLoading = true;
    this.clearError();

    const setTopTracks = (data: Track[]) => {
      this.isLoading = false;
      this.topTracks = data;
      this.displayMode = Display.TOP_LIST;
      this.trackId = undefined;
    };

    this.trackService
      .getTopTracks(n)
      .pipe(
        tap(setTopTracks),
        catchError((err: any) =>
          this.handleError(err, 'Failed to get top tracks')
        )
      )
      .subscribe();
  }

  showGraph() {
    this.isLoading = true;
    this.clearError();

    const setGraphData = (data: any) => {
      this.graphData = data;
      this.isLoading = false;
      this.displayMode = Display.GRAPH;
      this.trackId = undefined;
    };

    this.trackService
      .getGraphData()
      .pipe(
        tap(setGraphData),
        catchError((err: any) =>
          this.handleError(err, 'Failed to get statistics')
        )
      )
      .subscribe();
  }
}
