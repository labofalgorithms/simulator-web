import { SimulatorApp } from '../core/simulator-app.js';
import { circularListModule } from '../modules/circular-lists/circular-list-module.js';

const app = new SimulatorApp(circularListModule);
app.start();
