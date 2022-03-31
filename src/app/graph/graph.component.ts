import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

interface Point {
  x: string;
  y: number;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  @Input() data: Point[] = [];
  chartOption: EChartsOption = {};

  constructor() {}

  ngOnInit(): void {
    this.loadChartOptions();
  }

  loadChartOptions() {
    let xAxis = this.data.map((point: any) => point.x);
    let yData = this.data.map((point: any) => point.y);
    console.log(yData);

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: xAxis,
      },
      yAxis: {
        type: 'value',
        name: 'Total',
      },
      series: [
        {
          data: yData,
          type: 'bar',
        },
      ],
    };
  }
}
