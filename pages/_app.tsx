import type { AppProps, NextWebVitalsMetric } from 'next/app'
import '../styles/index.css'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
