interface AppProps {
	children: React.ReactNode;
}

export default function App({ children }: AppProps) {
	return <div className="min-h-screen bg-stone-50 text-stone-900">{children}</div>;
}
