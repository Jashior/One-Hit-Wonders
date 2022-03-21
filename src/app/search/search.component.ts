import { Component, OnInit } from '@angular/core';
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

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {}

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
