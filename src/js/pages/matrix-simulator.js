import { SimulatorApp } from '../core/simulator-app.js';
import { matrixModule } from '../modules/matrices/matrix-module.js';

const app = new SimulatorApp(matrixModule);
app.start();
