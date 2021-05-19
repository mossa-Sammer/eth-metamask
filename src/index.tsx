import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
// import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants'
import './i18n'
import App, { Poole } from './pages/App'
import { Connector } from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { REPLCommand } from 'repl'
import Web3ContextProvider from 'context/web3_tass'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
// if (typeof GOOGLE_ANALYTICS_ID === 'string') {
//   ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
//     gaOptions: {
//       storage: 'none',
//       storeGac: false
//     }
//   })
//   ReactGA.set({
//     anonymizeIp: true,
//     customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
//   })
// } else {
//   ReactGA.initialize('test', { testMode: true, debug: true })
// }

// window.addEventListener('error', error => {
//   ReactGA.exception({
//     description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
//     fatal: true
//   })
// })

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const TreeWrapper: React.FC = ({ children }: { children?: React.ReactNode }) => {
  return (
    <StrictMode>
      <FixedGlobalStyle />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Blocklist>
            <Provider store={store}>
              <Updaters />
              <ThemeProvider>
                <ThemedGlobalStyle />
                <HashRouter>{children}</HashRouter>
              </ThemeProvider>
            </Provider>
          </Blocklist>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </StrictMode>
  )
}

const root = document.getElementById('react_root')
if (root) {
  ReactDOM.render(
    <TreeWrapper>
      <Web3ContextProvider>
        <App />
      </Web3ContextProvider>
    </TreeWrapper>,
    root
  )
}

// const root_1 = document.getElementById('root_1')

// if (root_1) {
//   ReactDOM.render(
//     <TreeWrapper>
//       <Web3ContextProvider>
//         <Connector />
//       </Web3ContextProvider>
//     </TreeWrapper>,
//     root_1
//   )
// }

// const poolRoot = document.getElementById('pool_root')
// if (poolRoot) {
//   ReactDOM.render(
//     <TreeWrapper>
//       <Poole></Poole>
//     </TreeWrapper>,
//     poolRoot
//   )
// }

serviceWorkerRegistration.unregister()
