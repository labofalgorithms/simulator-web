import { SimulatorApp } from '../core/simulator-app.js';
import { queueModule } from '../modules/queues/queue-module.js';

const app = new SimulatorApp(queueModule);
app.start();
