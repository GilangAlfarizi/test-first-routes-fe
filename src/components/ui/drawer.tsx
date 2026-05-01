import * as React from "react";

import { cn } from "@/lib/utils";

type DrawerContextValue = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
	const context = React.useContext(DrawerContext);
	if (!context) throw new Error("Drawer components must be used inside Drawer.");
	return context;
}

function Drawer({
	open,
	onOpenChange,
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}) {
	return <DrawerContext.Provider value={{ open, onOpenChange }}>{children}</DrawerContext.Provider>;
}

function DrawerContent({ className, children }: React.ComponentProps<"div">) {
	const { open, onOpenChange } = useDrawerContext();
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 bg-black/50"
			onClick={() => onOpenChange(false)}
			role="presentation"
		>
			<div
				className={cn(
					"absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-card p-6 text-card-foreground shadow-lg max-md:top-auto max-md:h-[85vh] max-md:max-w-none max-md:rounded-t-3xl max-md:border-l-0 max-md:border-t",
					className,
				)}
				onClick={(event) => event.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<"h2">) {
	return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mt-6 flex flex-wrap justify-end gap-2", className)} {...props} />;
}

export { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle };
