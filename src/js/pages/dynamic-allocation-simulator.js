import { SimulatorApp } from '../core/simulator-app.js';
import { dynamicAllocationModule } from '../modules/dynamic-allocation/dynamic-allocation-module.js';

const app = new SimulatorApp(dynamicAllocationModule);
app.start();
