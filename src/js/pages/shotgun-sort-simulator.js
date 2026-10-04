import { SimulatorApp } from '../core/simulator-app.js';
import { shotgunSortModule } from '../modules/shotgun-sort/shotgun-sort-module.js';

const app = new SimulatorApp(shotgunSortModule);
app.start();
