import { SimulatorApp } from '../core/simulator-app.js';
import { countingSortModule } from '../modules/counting-sort/counting-sort-module.js';

const app = new SimulatorApp(countingSortModule);
app.start();
