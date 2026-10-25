import { SimulatorApp } from '../core/simulator-app.js';
import { searchesModule } from '../modules/searches/searches-module.js';

const app = new SimulatorApp(searchesModule);
app.start();
