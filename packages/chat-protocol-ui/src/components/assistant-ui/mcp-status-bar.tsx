"use client";

import { BlocksIcon, Loader2Icon, WifiOffIcon } from "lucide-react";
import { type FC, useCallback, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type McpProviderStatus, useMcpStatus } from "@/hooks/use-mcp-status";
import { useModelApiUrl } from "@/provider";

function statusColor(status: string): string {
	switch (status) {
		case "CONNECTED":
		case "ENABLED":
			return "bg-emerald-500";
		case "ERROR":
		case "DISABLED":
			return "bg-red-500";
		default:
			return "bg-muted-foreground";
	}
}

function StatusDot({ status }: { status: string }) {
	return (
		<span
			className={`inline-block size-1.5 rounded-full ${statusColor(status)}`}
			aria-hidden
		/>
	);
}

function ToolBadge({ name, status }: { name: string; status: string }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
			<span
				className={`inline-block size-1 rounded-full ${statusColor(status)}`}
				aria-hidden
			/>
			{name}
		</span>
	);
}

function ProviderSection({ provider }: { provider: McpProviderStatus }) {
	return (
		<div className="flex flex-col gap-1.5 border-b border-border/50 px-3 py-2.5 last:border-b-0">
			<div className="flex items-center gap-2">
				<StatusDot status={provider.status} />
				<span className="font-medium text-xs">{provider.serviceName}</span>
				<span className="ml-auto text-[10px] text-muted-foreground">
					{provider.status}
				</span>
			</div>
			<div className="flex flex-wrap gap-1.5 pl-3.5">
				{(
					provider.toolStatuses ??
					provider.toolNames.map((n) => ({ name: n, status: "ENABLED" }))
				).map((tool) => (
					<ToolBadge key={tool.name} name={tool.name} status={tool.status} />
				))}
			</div>
		</div>
	);
}

export const McpStatusBar: FC = () => {
	const apiUrl = useModelApiUrl();
	const { status, loading, error, refetchDebounced } = useMcpStatus(apiUrl);
	const [open, setOpen] = useState(false);

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			setOpen(isOpen);
			if (isOpen) {
				refetchDebounced();
			}
		},
		[refetchDebounced],
	);

	const icon = loading && !status ? (
		<Loader2Icon className="size-3.5 animate-spin" />
	) : error && !status ? (
		<WifiOffIcon className="size-3.5" />
	) : (
		<BlocksIcon className="size-3.5" />
	);

	return (
		<DropdownMenu open={open} onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex size-7 items-center justify-center rounded-md text-muted-foreground/50 hover:bg-accent hover:text-muted-foreground"
					aria-label="MCP status"
				>
					{icon}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" align="start" className="min-w-64">
				{error ? (
					<div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
						<WifiOffIcon className="size-3.5 shrink-0" />
						<span>MCP status unavailable</span>
					</div>
				) : !status || status.totalProviders === 0 ? (
					<div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
						<span>No MCP providers connected</span>
					</div>
				) : (
					<>
						<div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
							<span className="font-medium text-xs">MCP Providers</span>
							<span className="text-[10px] text-muted-foreground">
								{status.totalProviders} · {status.totalTools} tool
								{status.totalTools !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="py-1">
							{status.providers.map((provider) => (
								<ProviderSection
									key={provider.providerId}
									provider={provider}
								/>
							))}
						</div>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
