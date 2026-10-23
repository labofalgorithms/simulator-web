import { SimulatorApp } from '../core/simulator-app.js';
import { heapSortModule } from '../modules/heap-sort/heap-sort-module.js';

const app = new SimulatorApp(heapSortModule);
app.start();
