import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, defaultIfEmpty, switchMap } from 'rxjs/operators';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  selectedValue?: string;
  listOfOptions: Array<{ value: string; text: string }> = [];
  currentArtist?: any = {};
  isLoading = false;
  searchChange$ = new BehaviorSubject('');

  constructor(private trackService: TrackService, private http: HttpClient) {}

  ngOnInit(): void {
    const getTracks = (name: string): Observable<any> => {
      if (!name) return of();
      return this.trackService.getTracksByQuery(name);
    };

    const searchObs$: any = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getTracks));

    const toListOptions = (data: any[]): any => {
      const listOfOptions: Array<{ value: string; text: string }> = [];
      data.map((track: any) => {
        listOfOptions.push({
          value: track['_id'],
          text: track['artist'],
        });
      });
      return listOfOptions;
    };

    searchObs$.subscribe((data: any) => {
      const listOfOptions: Array<{ value: string; text: string }> = [];
      data.map((track: any) => {
        listOfOptions.push({
          value: track['_id'],
          text: track['artist'],
        });
      });
      this.listOfOptions = listOfOptions;
      this.isLoading = false;
      console.log(data);
    });
    // searchObs$.subscribe((value) => {
    //   console.log(value);
    //   console.log(`VALUE: ${value}`);
    //   if (!value) return;
    // value.subscribe((data) => {
    //   const listOfOptions: Array<{ value: string; text: string }> = [];
    //   data.map((track) => {
    //     listOfOptions.push({
    //       value: track['_id'],
    //       text: track['artist'],
    //     });
    //   });
    //   console.log(listOfOptions);
    //   this.listOfOptions = listOfOptions;
    //   this.isLoading = false;
    // })

    // this.trackService.getTracksByQuery(value).subscribe((data) => {
    //   const listOfOptions: Array<{ value: string; text: string }> = [];
    //   data.map((track) => {
    //     listOfOptions.push({
    //       value: track['_id'],
    //       text: track['artist'],
    //     });
    //   });
    //   console.log(listOfOptions);
    //   this.listOfOptions = listOfOptions;
    //   this.isLoading = false;
    // });
    // });
  }

  onChange() {
    if (this.selectedValue == null) return;
    if (!this.selectedValue) return;
    this.trackService
      .getTrackById(this.selectedValue)
      .subscribe((data: any) => {
        this.currentArtist = data;
        console.log(this.currentArtist);
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

  search(value: string): void {
    if (value.length < 1) {
      return;
    }
    this.isLoading = true;
    this.trackService.getTracksByQuery(value).subscribe((data) => {
      const listOfOptions: Array<{ value: string; text: string }> = [];
      data.map((track) => {
        listOfOptions.push({
          value: track['_id'],
          text: track['artist'],
        });
      });
      this.listOfOptions = listOfOptions;
      this.isLoading = false;
    });
  }
}
