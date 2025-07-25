import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import databseConnection from './setupDatabse';
import { config } from './config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
