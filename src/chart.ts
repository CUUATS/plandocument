import * as Plottable from 'plottable';


export type Alignment = 'left' | 'center' | 'right';
export type AxisName = 'x' | 'y';
export type AxisPosition = 'bottom' | 'left' | 'right' | 'top';
export type AxisType = Plottable.Axes.Category
  | Plottable.Axes.Numeric
  | Plottable.Axes.Time;
export type AxisTypeOption = 'auto' | 'category' | 'numeric' | 'time';
export type AxisScaleType = Plottable.Scales.Category
  | Plottable.Scales.Linear
  | Plottable.Scales.Time;
export type AxisScaleValue = number | string | Date;
export type ChartType = 'bar' | 'stacked-bar' | 'pie' | 'line'
  | 'area' | 'scatter';
export type SeriesScaleType = Plottable.Scales.Color;


export interface ChartOptions {
  dateRegex?: RegExp;
  legend?: boolean;
  legendAlignment: Alignment;
  legendRowWidth: number;
  lineWidth?: number;
  numberRegex?: RegExp;
  redrawRate?: number;
  title?: string;
  type?: ChartType;
  xLabel?: string;
  xRotate?: number;
  xType?: AxisTypeOption;
  yLabel?: string;
  yRotate?: number;
  yType?: AxisTypeOption;
}


export class Chart {
  el: HTMLElement;
  data: string | any[][];
  defaultOptions: ChartOptions = {
    dateRegex: /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/,
    legend: true,
    legendAlignment: 'right',
    legendRowWidth: 1,
    lineWidth: 2,
    numberRegex: /^[\s$]*([\d.]+)[\s%]*$/,
    redrawRate: 15,
    title: null,
    type: 'bar',
    xLabel: null,
    xType: 'auto',
    xRotate: 0,
    yLabel: null,
    yRotate: 0,
    yType: 'auto'
  };
  legend: Plottable.Components.Legend;
  options: ChartOptions;
  plots: Plottable.Components.Group;
  resizeTimeout: number;
  sScale: SeriesScaleType;
  table: Plottable.Components.Table;
  title: Plottable.Components.TitleLabel;
  xAxis: AxisType;
  xLabel: Plottable.Components.AxisLabel;
  xScale: AxisScaleType;
  yAxis: AxisType;
  yLabel: Plottable.Components.AxisLabel;
  yScale: AxisScaleType;

  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: ChartOptions) {
    console.log('DATA', data);
    console.log('OPTIONS', options);

    this.options = this.getOptions(options, data);
    this.el = this.getElement(target);
    this.data = this.getData(data);
    this.title = this.getTitle();

    this.sScale = this.getSeriesScale();
    this.xScale = this.getAxisScale('x');
    this.yScale = this.getAxisScale('y');

    this.xAxis = this.getAxis('x');
    this.yAxis = this.getAxis('y');

    this.xLabel = this.getAxisLabel('x');
    this.yLabel = this.getAxisLabel('y');

    this.legend = this.getLegend();

    this.plots = this.getPlots();
    this.table = this.getTable();

    this.render();
  }

  getOptions(options: ChartOptions, data: any[][]) {
    let result = {...this.defaultOptions, ...options};

    if (result.xType === 'auto')
      result.xType = this.guessAxisType(result, data[1][0]);
    if (result.yType === 'auto')
      result.yType = this.guessAxisType(result, data[1][1]);

    return result;
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

  getTitle() : Plottable.Components.TitleLabel {
    return (this.options.title) ?
      new Plottable.Components.TitleLabel(this.options.title) : null;
  }

  getSeriesScale() {
    // TODO: Add a color setting that can customize the series scale.
    return new Plottable.Scales.Color();
  }

  getAxisScale(axis: AxisName) {
    if (this.options.type === 'pie' && axis === 'y') return null;

    let axisType = (axis === 'x') ? this.options.xType : this.options.yType;
    if (axisType === 'category') return new Plottable.Scales.Category();
    if (axisType === 'time') return new Plottable.Scales.Time();
    return new Plottable.Scales.Linear();
  }

  guessAxisType(options: ChartOptions, value: any) : AxisTypeOption {
    if (typeof value !== 'string')
      return (value instanceof Date) ? 'time' : 'numeric';

    if (options.dateRegex.test(value)) return 'time';
    if (options.numberRegex.test(value)) return 'numeric';
    return 'category';
  }

  getAxis(axis: AxisName) : AxisType {
    if (this.options.type === 'pie') return null;
    let scale = (axis === 'x') ? this.xScale : this.yScale;
    let position : AxisPosition = (axis === 'x') ? 'bottom' : 'left';

    if (scale instanceof Plottable.Scales.Category)
      return new Plottable.Axes.Category(scale, position);
    if (position == 'bottom' && scale instanceof Plottable.Scales.Time)
      return new Plottable.Axes.Time(scale, position);
    if (scale instanceof Plottable.Scales.Linear)
      return new Plottable.Axes.Numeric(scale, position);

    return null;
  }

  getAxisLabel(axis: AxisName) {
    let axisObj = (axis === 'x') ? this.xAxis : this.yAxis;
    let axisText = (axis === 'x') ? this.options.xLabel : this.options.yLabel;
    let rotation = (axis === 'x') ? 0 : -90;
    return (axisObj && axisText) ?
      new Plottable.Components.AxisLabel(axisText, rotation) : null;
  }

  getLegend() : Plottable.Components.Legend {
    if (this.options.legend && this.sScale) {
      return new Plottable.Components.Legend(this.sScale)
        .maxEntriesPerRow(this.options.legendRowWidth)
        .xAlignment(this.options.legendAlignment);
    }
    return null;
  }

  getPlots() : Plottable.Components.Group {
    let plots = new Plottable.Components.Group();
    for (let col = 1; col < this.data[0].length; col++) {
      let seriesName = this.data[0][col];
      let dataset = this.getDataset(col);
      let plot = this.getPlot(seriesName, dataset);
      plots.append(plot);
    }
    return plots;
  }

  getDataset(col: number) : Plottable.Dataset {
    let data = [];
    for (let row = 1; row < this.data.length; row++) {
      data.push({
        x: this.data[row][0],
        y: this.data[row][col]
      });
    }
    return new Plottable.Dataset(data);
  }

  getPlot(seriesName: string, dataset: Plottable.Dataset) {
    let plot = new Plottable.Plots.Line()
      .addDataset(dataset);

    if (this.xScale) plot.x((d) => d.x, this.xScale);
    if (this.yScale instanceof Plottable.Scales.Linear)
      plot.y((d) => d.y, this.yScale);

    if (this.sScale) plot.attr('stroke', this.sScale.scale(seriesName));
    plot.attr('stroke-width', this.options.lineWidth);
    return plot;
  }

  getTable() : Plottable.Components.Table {
    return new Plottable.Components.Table([
      [null, null, this.title],
      [null, null, this.legend],
      [this.yLabel, this.yAxis, this.plots],
      [null, null, this.xAxis],
      [null, null, this.xLabel]
    ]);
  }

  marshall(value: any, row: number, col: number) {
    if (row === 0) return value.toString();
    if (col === 0) return this.toScaleType(value, this.xScale);
    return this.toScaleType(value, this.yScale);
  }

  toScaleType(value: any, scale: AxisScaleType) : AxisScaleValue {
    if (scale instanceof Plottable.Scales.Linear) {
      if (typeof value === 'number') return value;
      let matches = value.toString().match(this.options.numberRegex);
      return (matches.length > 1) ? matches[1] : null;
    }

    if (scale instanceof Plottable.Scales.Time) {
      if (value instanceof Date) return value;
      let matches = value.toString().match(this.options.dateRegex);
      return (matches.length > 3) ?
        new Date(+matches[3], +matches[1] - 1, +matches[2]) : null;
    }

    return value.toString();
  }

  render() {
    this.table.renderTo(this.el);

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) return;
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = null;
        this.table.redraw();
      }, Math.round(1000 / this.options.redrawRate));
    });
  }
}
