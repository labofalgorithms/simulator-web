import { SimulatorApp } from '../core/simulator-app.js';
import { insertionSortModule } from '../modules/insertion-sort/insertion-sort-module.js';

const app = new SimulatorApp(insertionSortModule);
app.start();
