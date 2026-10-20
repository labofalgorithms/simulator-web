import { SimulatorApp } from '../core/simulator-app.js';
import { quickSortModule } from '../modules/quick-sort/quick-sort-module.js';

const app = new SimulatorApp(quickSortModule);
app.start();
