import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, defaultIfEmpty, switchMap, map } from 'rxjs/operators';
import { TrackService } from '../services/track.service';
import { Artist } from '../models/Artist';
import { Track } from '../models/Track';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  selectedValue?: string;
  listOfOptions: Artist[] = [];
  track?: Track;
  isLoading = false;
  searchChange$ = new BehaviorSubject('');

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
      .subscribe((data) => {
        this.listOfOptions = data;
        this.isLoading = false;
      });
  }

  onChange() {
    if (this.selectedValue == null) return;
    if (!this.selectedValue) return;
    this.trackService
      .getTrackById(this.selectedValue)
      .subscribe((data: Track) => {
        this.track = data;
        console.log(this.track);
      });
  }

  onSearch(value: string): void {
    if (value.length < 1) {
      return;
    }
    this.isLoading = true;
    this.searchChange$.next(value);
    console.log(`searchChange$ next = ${this.searchChange$.value}`);
  }
}
