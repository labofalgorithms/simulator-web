import { SimulatorApp } from '../core/simulator-app.js';
import { recursionModule } from '../modules/recursion/recursion-module.js';

const app = new SimulatorApp(recursionModule);
app.start();
