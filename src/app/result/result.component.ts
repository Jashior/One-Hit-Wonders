import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../models/Track';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  @Input() track: Track | undefined;

  constructor() {}

  ngOnInit(): void {}

  formatPercent(val: any) {
    return (100 * val).toFixed(2);
  }
}
