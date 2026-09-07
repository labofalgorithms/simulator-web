import { SimulatorApp } from '../core/simulator-app.js';
import { doublyLinkedListModule } from '../modules/doubly-linked-lists/doubly-linked-list-module.js';

const app = new SimulatorApp(doublyLinkedListModule);
app.start();
