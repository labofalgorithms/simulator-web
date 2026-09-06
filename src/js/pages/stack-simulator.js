import { SimulatorApp } from '../core/simulator-app.js';
import { stackModule } from '../modules/stacks/stack-module.js';

const app = new SimulatorApp(stackModule);
app.start();
