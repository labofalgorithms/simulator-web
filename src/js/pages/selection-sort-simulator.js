import { SimulatorApp } from '../core/simulator-app.js';
import { selectionSortModule } from '../modules/selection-sort/selection-sort-module.js';

const app = new SimulatorApp(selectionSortModule);
app.start();
