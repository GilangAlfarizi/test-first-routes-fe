import * as React from "react";

import { cn } from "@/lib/utils";

type AlertDialogContextValue = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
	const context = React.useContext(AlertDialogContext);
	if (!context) throw new Error("AlertDialog components must be used inside AlertDialog.");
	return context;
}

function AlertDialog({
	open,
	onOpenChange,
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		<AlertDialogContext.Provider value={{ open, onOpenChange }}>
			{children}
		</AlertDialogContext.Provider>
	);
}

function AlertDialogContent({ className, children }: React.ComponentProps<"div">) {
	const { open, onOpenChange } = useAlertDialogContext();
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={() => onOpenChange(false)}
		>
			<div
				className={cn("w-full max-w-md rounded-3xl border bg-card p-6 shadow-lg", className)}
				onClick={(event) => event.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("space-y-1.5", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
	return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

function AlertDialogCancel({
	asChild,
	children,
}: {
	asChild?: boolean;
	children: React.ReactElement<{ onClick?: () => void }>;
}) {
	const { onOpenChange } = useAlertDialogContext();
	if (asChild) {
		return React.cloneElement(children, {
			onClick: () => onOpenChange(false),
		});
	}
	return <button onClick={() => onOpenChange(false)}>{children}</button>;
}

function AlertDialogAction({
	asChild,
	children,
}: {
	asChild?: boolean;
	children: React.ReactElement<{ onClick?: () => void }>;
}) {
	const { onOpenChange } = useAlertDialogContext();
	if (asChild) {
		const childOnClick = children.props.onClick;
		return React.cloneElement(children, {
			onClick: () => {
				childOnClick?.();
				onOpenChange(false);
			},
		});
	}
	return <button onClick={() => onOpenChange(false)}>{children}</button>;
}

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
};
