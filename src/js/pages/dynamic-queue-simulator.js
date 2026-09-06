import { SimulatorApp } from '../core/simulator-app.js';
import { dynamicQueueModule } from '../modules/dynamic-queues/dynamic-queue-module.js';

const app = new SimulatorApp(dynamicQueueModule);
app.start();
