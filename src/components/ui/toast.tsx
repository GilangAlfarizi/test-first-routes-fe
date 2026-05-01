/* eslint-disable react-refresh/only-export-components */
import * as React from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "default" | "destructive";

type ToastItem = {
	id: number;
	title: string;
	description?: string;
	variant: ToastVariant;
};

type ToastContextValue = {
	toast: (input: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<ToastItem[]>([]);

	const toast = React.useCallback((input: Omit<ToastItem, "id">) => {
		const id = Date.now() + Math.floor(Math.random() * 1000);
		setToasts((current) => [...current, { ...input, id }]);
		window.setTimeout(() => {
			setToasts((current) => current.filter((item) => item.id !== id));
		}, 3000);
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
				{toasts.map((item) => (
					<div
						key={item.id}
						className={cn(
							"rounded-2xl border p-4 shadow-md",
							item.variant === "destructive"
								? "border-destructive/30 bg-destructive/10 text-destructive"
								: "border-border bg-card text-card-foreground",
						)}
					>
						<p className="text-sm font-semibold">{item.title}</p>
						{item.description ? (
							<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
						) : null}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider.");
	}
	return context;
}
