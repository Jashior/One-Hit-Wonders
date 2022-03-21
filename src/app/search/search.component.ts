import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  selectedValue = '';
  listOfOptions: Array<{ value: string; text: string }> = [];
  nzFilterOption = (): boolean => true;
  currentArtist?: any = {};

  constructor(
    private trackService: TrackService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {}

  loadArtistInfo() {
    if (this.selectedValue == null) return;
    if (!this.selectedValue) return;
    this.trackService
      .getTrackById(this.selectedValue)
      .subscribe((data: any) => {
        this.currentArtist = data;
        console.log(this.currentArtist);
      });
  }

  search(value: string): void {
    if (value.length < 2) {
      return;
    }
    this.trackService.getTracksByQuery(value).subscribe((data) => {
      const listOfOptions: Array<{ value: string; text: string }> = [];
      data.map((track) => {
        listOfOptions.push({
          value: track['_id'],
          text: track['artist'],
        });
      });
      this.listOfOptions = listOfOptions;
    });
  }
}
