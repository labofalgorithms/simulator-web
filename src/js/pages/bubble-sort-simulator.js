import { SimulatorApp } from '../core/simulator-app.js';
import { bubbleSortModule } from '../modules/bubble-sort/bubble-sort-module.js';

const app = new SimulatorApp(bubbleSortModule);
app.start();
