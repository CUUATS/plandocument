import * as Plottable from 'plottable';

export type AxisType = 'auto' | 'category' | 'numeric' | 'time';
export type AxisScaleType = Plottable.Scales.Category
  | Plottable.Scales.Linear
  | Plottable.Scales.Time;
export type ChartType = 'bar' | 'stacked-bar' | 'pie' | 'line'
  | 'area' | 'scatter';

export interface ChartOptions {
  type?: ChartType;
  title?: string;
  legend?: boolean;
  xlabel?: string;
  xrotate?: number;
  xtype?: AxisType;
  ylabel?: string;
  yrotate?: number;
  ytype?: AxisType;
}

export class Chart {
  el: HTMLElement;
  chart: Plottable.Components.Table;
  data: string | any[][];
  defaultOptions: ChartOptions = {
    type: 'bar',
    title: null,
    legend: true,
    xlabel: null,
    xtype: 'auto',
    xrotate: 0,
    ylabel: null,
    yrotate: 0,
    ytype: 'auto'
  };
  options: ChartOptions;
  xscale: AxisScaleType;
  yscale: AxisScaleType;

  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: ChartOptions) {
    console.log('DATA', data);
    console.log('OPTIONS', options);

    this.options = this.getOptions(options);
    this.el = this.getElement(target);
    this.data = this.getData(data);
    this.xscale = this.getScale('x');
    this.yscale = this.getScale('y');

    var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Linear();

    var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    var plot = new Plottable.Plots.Line();
    plot.x(function(d) { return d.x; }, xScale);
    plot.y(function(d) { return d.y; }, yScale);

    var chartData = [
     { "x": 0, "y": 1 },
     { "x": 1, "y": 2 },
     { "x": 2, "y": 4 },
     { "x": 3, "y": 8 }
    ];

    var dataset = new Plottable.Dataset(chartData);
    plot.addDataset(dataset);

    this.chart = new Plottable.Components.Table([
     [yAxis, plot],
     [null, xAxis]
    ]);

    this.chart.renderTo(this.el);
  }

  getOptions(options: ChartOptions) {
    return {...this.defaultOptions, ...options};
  }

  getElement(target: string | HTMLElement) {
    if (target instanceof HTMLElement) return target;
    return document.getElementById(target);
  }

  getData(data: any[][]) : any[][] {
    return data.map((row, r) => {
      return row.map((item, i) => this.marshall(item, r, i));
    });
  }

  getScale(axis: 'x' | 'y') {

  }

  marshall(value: any, row: number, col: number) {
    if (row === 0) return value;

  }
}
