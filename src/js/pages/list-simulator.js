import { SimulatorApp } from '../core/simulator-app.js';
import { listModule } from '../modules/lists/list-module.js';

const app = new SimulatorApp(listModule);
app.start();
