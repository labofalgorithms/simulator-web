import { SimulatorApp } from '../core/simulator-app.js';
import { hashTableModule } from '../modules/hash-tables/hash-table-module.js';

const app = new SimulatorApp(hashTableModule);
app.start();
