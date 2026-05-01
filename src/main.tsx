"use client";

import App from "@/App";

interface MainProps {
	children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
	return (
		<App>
			<main className="flex min-h-screen flex-col">{children}</main>
		</App>
	);
}
