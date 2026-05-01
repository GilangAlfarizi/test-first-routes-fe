import * as React from "react";

import { cn } from "@/lib/utils";

type DialogContextValue = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
	const context = React.useContext(DialogContext);
	if (!context) {
		throw new Error("Dialog components must be used inside Dialog.");
	}
	return context;
}

function Dialog({
	open,
	onOpenChange,
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}) {
	return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({
	asChild,
	children,
}: {
	asChild?: boolean;
	children: React.ReactElement<{ onClick?: () => void }>;
}) {
	const { onOpenChange } = useDialogContext();
	if (asChild) {
		return React.cloneElement(children, {
			onClick: () => onOpenChange(true),
		});
	}
	return <button onClick={() => onOpenChange(true)}>{children}</button>;
}

function DialogContent({ className, children }: React.ComponentProps<"div">) {
	const { open, onOpenChange } = useDialogContext();
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={() => onOpenChange(false)}
		>
			<div
				className={cn(
					"w-full max-w-2xl rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-lg",
					className,
				)}
				onClick={(event) => event.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
	return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

function DialogClose({
	asChild,
	children,
}: {
	asChild?: boolean;
	children: React.ReactElement<{ onClick?: () => void }>;
}) {
	const { onOpenChange } = useDialogContext();
	if (asChild) {
		return React.cloneElement(children, {
			onClick: () => onOpenChange(false),
		});
	}
	return <button onClick={() => onOpenChange(false)}>{children}</button>;
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
