import { SimulatorApp } from '../core/simulator-app.js';
import { bucketSortModule } from '../modules/bucket-sort/bucket-sort-module.js';

const app = new SimulatorApp(bucketSortModule);
app.start();
