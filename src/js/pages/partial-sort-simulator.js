import { SimulatorApp } from '../core/simulator-app.js';
import { partialSortModule } from '../modules/partial-sort/partial-sort-module.js';

const app = new SimulatorApp(partialSortModule);
app.start();
