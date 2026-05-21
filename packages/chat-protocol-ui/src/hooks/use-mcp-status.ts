"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToolStatus = {
	name: string;
	status: string;
};

export type McpProviderStatus = {
	providerId: string;
	serviceName: string;
	transportType: string;
	url: string;
	status: string;
	toolCount: number;
	toolNames: string[];
	toolStatuses: ToolStatus[];
	registeredAt: string | null;
};

export type McpStatusResponse = {
	totalProviders: number;
	totalTools: number;
	providers: McpProviderStatus[];
};

function deriveMcpStatusUrl(apiUrl: string): string {
	try {
		const url = new URL(apiUrl);
		url.pathname = "/api/chat/mcp/providers/status";
		return url.toString();
	} catch {
		return `${apiUrl.replace(/\/runs$/, "")}/mcp/providers/status`;
	}
}

export function useMcpStatus(apiUrl: string) {
	const [status, setStatus] = useState<McpStatusResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchStatus = useCallback(async () => {
		if (!apiUrl) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const statusUrl = deriveMcpStatusUrl(apiUrl);
			const response = await fetch(statusUrl);

			if (!response.ok) {
				throw new Error(`Failed to fetch MCP status: ${response.status}`);
			}

			const data: McpStatusResponse = await response.json();
			setStatus(data);
		} catch (err) {
			console.error("Failed to fetch MCP status:", err);
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, [apiUrl]);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	const refetchDebounced = useCallback(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
		debounceRef.current = setTimeout(() => {
			fetchStatus();
		}, 300);
	}, [fetchStatus]);

	return { status, loading, error, refetch: fetchStatus, refetchDebounced };
}
