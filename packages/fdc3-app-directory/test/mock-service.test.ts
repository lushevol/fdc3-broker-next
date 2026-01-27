/**
 * MockAppDirectoryService Unit Tests
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { MockAppDirectoryService } from '../src/mock-service';
import type { AppDefinition } from '../src/types';

describe('MockAppDirectoryService', () => {
  let mockService: MockAppDirectoryService;
  const chartApp: AppDefinition = {
    appId: 'my-chart-app',
    name: 'Advanced Chart',
    version: '1.0.0',
    title: 'Chart',
    description: 'Financial charting application',
    categories: ['Analytics', 'Charting'],
    interop: {
      intents: {
        listensFor: [
          {
            intent: 'ViewChart',
            contexts: ['fdc3.instrument', 'fdc3.portfolio'],
          },
        ],
      },
    },
  };

  const orderApp: AppDefinition = {
    appId: 'my-order-app',
    name: 'Order Management',
    version: '1.0.0',
    interop: {
      intents: {
        listensFor: [
          {
            intent: 'ViewOrder',
            contexts: ['fdc3.instrument'],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    mockService = new MockAppDirectoryService();
  });

  describe('registerApp', () => {
    it('should register an app', async () => {
      mockService.registerApp(chartApp);

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(1);
      expect(apps[0]).toEqual(chartApp);
    });

    it('should register multiple apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(2);
    });
  });

  describe('unregisterApp', () => {
    it('should unregister an app', async () => {
      mockService.registerApp(chartApp);
      mockService.unregisterApp('my-chart-app');

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should clear all registered apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);
      mockService.clear();

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(0);
    });
  });

  describe('getAllApps', () => {
    it('should return all registered apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(2);
    });

    it('should return empty array when no apps registered', async () => {
      const apps = await mockService.getAllApps();
      expect(apps).toEqual([]);
    });
  });

  describe('getApp', () => {
    it('should return app by ID', async () => {
      mockService.registerApp(chartApp);

      const app = await mockService.getApp('my-chart-app');
      expect(app).toEqual(chartApp);
    });

    it('should return null when app not found', async () => {
      const app = await mockService.getApp('non-existent');
      expect(app).toBeNull();
    });
  });

  describe('findByIntent', () => {
    it('should find apps that handle specific intent', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      const apps = await mockService.findByIntent('ViewChart');
      expect(apps).toHaveLength(1);
      expect(apps[0].appId).toBe('my-chart-app');
    });

    it('should return empty array when no apps handle intent', async () => {
      mockService.registerApp(orderApp);

      const apps = await mockService.findByIntent('ViewChart');
      expect(apps).toEqual([]);
    });
  });

  describe('findByContextType', () => {
    it('should find apps that handle specific context type', async () => {
      mockService.registerApp(chartApp);

      const apps = await mockService.findByContextType('fdc3.instrument');
      expect(apps).toHaveLength(1);
      expect(apps[0].appId).toBe('my-chart-app');
    });

    it('should return empty array when no apps handle context type', async () => {
      mockService.registerApp(orderApp);

      const apps = await mockService.findByContextType('fdc3.contact');
      expect(apps).toEqual([]);
    });
  });

  describe('findByCategory', () => {
    it('should find apps by category', async () => {
      mockService.registerApp(chartApp);

      const apps = await mockService.findByCategory('Analytics');
      expect(apps).toHaveLength(1);
      expect(apps[0].appId).toBe('my-chart-app');
    });

    it('should return empty array when no apps in category', async () => {
      mockService.registerApp(orderApp);

      const apps = await mockService.findByCategory('Analytics');
      expect(apps).toEqual([]);
    });
  });
});
