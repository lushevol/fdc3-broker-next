/**
 * App Directory Integration Tests
 *
 * Tests the interaction between client and mock service.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { AppDirectoryClientImpl } from '../src/client';
import { MockAppDirectoryService } from '../src/mock-service';
import type { AppDefinition } from '../src/types';

describe('App Directory Integration', () => {
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
          {
            intent: 'ViewAnalysis',
            contexts: ['fdc3.portfolio'],
          },
        ],
      },
    },
  };

  const orderApp: AppDefinition = {
    appId: 'my-order-app',
    name: 'Order Management',
    version: '1.0.0',
    categories: ['Trading'],
    interop: {
      intents: {
        listensFor: [
          {
            intent: 'ViewOrder',
            contexts: ['fdc3.instrument'],
          },
        ],
        raises: [
          {
            intent: 'OrderFilled',
            contexts: ['fdc3.order'],
          },
        ],
      },
    },
  };

  describe('MockAppDirectoryService', () => {
    let mockService: MockAppDirectoryService;

    beforeEach(() => {
      mockService = new MockAppDirectoryService();
    });

    it('should register and retrieve multiple apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      const allApps = await mockService.getAllApps();
      expect(allApps).toHaveLength(2);

      // Verify both apps are present
      const appIds = allApps.map((app) => app.appId);
      expect(appIds).toContain('my-chart-app');
      expect(appIds).toContain('my-order-app');
    });

    it('should find apps by intent', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      // Find apps that handle ViewChart intent
      const chartApps = await mockService.findByIntent('ViewChart');
      expect(chartApps).toHaveLength(1);
      expect(chartApps[0].appId).toBe('my-chart-app');

      // Find apps that handle ViewOrder intent
      const orderApps = await mockService.findByIntent('ViewOrder');
      expect(orderApps).toHaveLength(1);
      expect(orderApps[0].appId).toBe('my-order-app');
    });

    it('should find apps by context type', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      // Both apps handle fdc3.instrument
      const apps = await mockService.findByContextType('fdc3.instrument');
      expect(apps).toHaveLength(2);

      // Only chart app handles fdc3.portfolio
      const portfolioApps = await mockService.findByContextType('fdc3.portfolio');
      expect(portfolioApps).toHaveLength(1);
      expect(portfolioApps[0].appId).toBe('my-chart-app');
    });

    it('should find apps by category', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      // Find analytics apps
      const analyticsApps = await mockService.findByCategory('Analytics');
      expect(analyticsApps).toHaveLength(1);
      expect(analyticsApps[0].appId).toBe('my-chart-app');

      // Find trading apps
      const tradingApps = await mockService.findByCategory('Trading');
      expect(tradingApps).toHaveLength(1);
      expect(tradingApps[0].appId).toBe('my-order-app');
    });

    it('should handle app not found gracefully', async () => {
      mockService.registerApp(chartApp);

      const app = await mockService.getApp('non-existent');
      expect(app).toBeNull();
    });

    it('should unregister apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);

      // Unregister one app
      mockService.unregisterApp('my-chart-app');

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(1);
      expect(apps[0].appId).toBe('my-order-app');
    });

    it('should clear all apps', async () => {
      mockService.registerApp(chartApp);
      mockService.registerApp(orderApp);
      mockService.clear();

      const apps = await mockService.getAllApps();
      expect(apps).toHaveLength(0);
    });

    it('should support multiple intents per app', async () => {
      mockService.registerApp(chartApp);

      // Chart app handles both ViewChart and ViewAnalysis
      const viewChartApps = await mockService.findByIntent('ViewChart');
      const viewAnalysisApps = await mockService.findByIntent('ViewAnalysis');

      expect(viewChartApps).toHaveLength(1);
      expect(viewAnalysisApps).toHaveLength(1);
      expect(viewChartApps[0].appId).toBe('my-chart-app');
      expect(viewAnalysisApps[0].appId).toBe('my-chart-app');
    });

    it('should support apps with intents that raise other intents', async () => {
      mockService.registerApp(orderApp);

      const app = await mockService.getApp('my-order-app');
      expect(app?.interop?.intents?.raises).toBeDefined();
      expect(app?.interop?.intents?.raises).toHaveLength(1);
      expect(app?.interop?.intents?.raises?.[0].intent).toBe('OrderFilled');
    });
  });

  describe('AppDirectoryClientImpl Configuration', () => {
    it('should create client with auth token', () => {
      const client = new AppDirectoryClientImpl({
        baseUrl: 'https://app-directory.example.com/api',
        authToken: 'test-token',
      });

      expect(client).toBeInstanceOf(AppDirectoryClientImpl);
    });

    it('should create client without auth token', () => {
      const client = new AppDirectoryClientImpl({
        baseUrl: 'https://app-directory.example.com/api',
      });

      expect(client).toBeInstanceOf(AppDirectoryClientImpl);
    });

    it('should create client with custom timeout', () => {
      const client = new AppDirectoryClientImpl({
        baseUrl: 'https://app-directory.example.com/api',
        timeout: 30000,
      });

      expect(client).toBeInstanceOf(AppDirectoryClientImpl);
    });
  });
});
