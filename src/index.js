require('./scss/plandocument.scss');
require('../node_modules/plottable/plottable.css');
require('uswds/dist/js/uswds.js');
const charts = require('./chart.ts');
window.pd ={
  'Chart': charts.Chart
};
