import { TonConnectUIProvider } from '@tonconnect/ui-react'
import App from './App'
import './index.css'

function Root() {
  return (
    <TonConnectUIProvider 
      manifestUrl={import.meta.env.VITE_TON_CONNECT_MANIFEST || 'https://your-domain.com/tonconnect-manifest.json'}
    >
      <App />
    </TonConnectUIProvider>
  )
}

export default Root
