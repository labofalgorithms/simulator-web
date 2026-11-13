import { SimulatorApp } from '../core/simulator-app.js';
import { mixedSortModule } from '../modules/mixed-sort/mixed-sort-module.js';

const app = new SimulatorApp(mixedSortModule);
app.start();
