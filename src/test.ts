import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Require all test files dynamically
declare const require: any;
const context = require.context('./', true, /\.spec\.ts$/);
console.log('Test files found:', context.keys());
context.keys().forEach(context);
