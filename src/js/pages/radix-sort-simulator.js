import { SimulatorApp } from '../core/simulator-app.js';
import { radixSortModule } from '../modules/radix-sort/radix-sort-module.js';

const app = new SimulatorApp(radixSortModule);
app.start();
