interface AppProps {
  children?: React.ReactNode;
}

export default function App({ children }: AppProps) {
  return <>{children}</>;
}
