import { SimulatorApp } from '../core/simulator-app.js';
import { dynamicListModule } from '../modules/dynamic-lists/dynamic-list-module.js';

const app = new SimulatorApp(dynamicListModule);
app.start();
