import { SimulatorApp } from '../core/simulator-app.js';
import { mergeSortModule } from '../modules/merge-sort/merge-sort-module.js';

const app = new SimulatorApp(mergeSortModule);
app.start();
