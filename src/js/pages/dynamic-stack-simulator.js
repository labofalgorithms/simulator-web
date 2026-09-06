import { SimulatorApp } from '../core/simulator-app.js';
import { dynamicStackModule } from '../modules/dynamic-stacks/dynamic-stack-module.js';

const app = new SimulatorApp(dynamicStackModule);
app.start();
