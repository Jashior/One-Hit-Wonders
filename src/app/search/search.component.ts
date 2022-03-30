import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  debounceTime,
  defaultIfEmpty,
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';
import { TrackService } from '../services/track.service';
import { Artist } from '../models/Artist';
import { Track } from '../models/Track';
import { ThrowStmt } from '@angular/compiler';

enum Display {
  'SEARCH',
  'TOP_LIST',
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  selectedValue?: string;
  listOfOptions: Artist[] = [];
  track?: Track;
  topTracks?: Track[];
  isLoading = false;
  searchChange$ = new BehaviorSubject('');
  Display = Display; // So HTML template can use the enum
  displayMode: Display | undefined; // Either 'SEARCH' or 'TOP_LIST'

  // error
  errorMessage?: string;
  error: boolean = false;

  constructor(private trackService: TrackService, private http: HttpClient) {}

  ngOnInit(): void {
    // HTTP request pipe inside switchMap so it can be canceled on immediate subsequent request
    const getTracks = (name: string): Observable<any> => {
      if (!name) return of();
      return this.trackService.getTracksByQuery(name);
    };

    // Mapping data to correct form for the drop down search menu
    const toList = (data: any[]): Artist[] =>
      data.map((t: any): Artist => ({ id: t['_id'], name: t['artist'] }));

    // Observing the search subject
    const searchObs$: any = this.searchChange$
      .asObservable()
      .pipe(debounceTime(100))
      .pipe(switchMap(getTracks))
      .pipe(map(toList))
      .subscribe(
        (data) => {
          this.listOfOptions = data;
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          this.displayError('Could not fetch results from search query');
        }
      );
  }

  onSelectArtist() {
    if (!this.selectedValue) return;
    this.clearError();
    this.trackService.getTrackById(this.selectedValue).subscribe(
      (data: Track) => {
        this.isLoading = false;
        this.track = data;
        this.displayMode = Display.SEARCH;
      },
      (err) => {
        console.log(err);
        this.displayError('Could not fetch artist result');
      }
    );
  }

  onSearch(value: string): void {
    if (value.length < 2) return;
    this.isLoading = true;
    this.clearError();
    console.log(`Searching ${value}`);
    this.searchChange$.next(value);
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
    this.trackService.getTopTracks(n).subscribe(
      (data: Track[]) => {
        this.isLoading = false;
        this.topTracks = data;
        this.displayMode = Display.TOP_LIST;
        this.selectedValue = undefined;
      },
      (err) => {
        this.displayError(`Couldn't get top list from database`);
      }
    );
  }
}
