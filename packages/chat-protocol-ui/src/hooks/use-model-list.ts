'use client';

import { useCallback, useEffect, useState } from 'react';

export type ModelOption = {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
  description?: string;
};

type ModelListResponse = {
  models: ModelOption[];
};

function deriveModelsUrl(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    url.pathname = '/api/chat/models';
    return url.toString();
  } catch {
    return `${apiUrl.replace(/\/runs$/, '')}/models`;
  }
}

export function useModelList(apiUrl: string) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    if (!apiUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const modelsUrl = deriveModelsUrl(apiUrl);
      const response = await fetch(modelsUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data: ModelListResponse = await response.json();
      setModels(data.models ?? []);
    } catch (err) {
      console.error('Failed to fetch model list:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, loading, error, refetch: fetchModels };
}
