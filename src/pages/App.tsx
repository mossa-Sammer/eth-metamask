import ReactDOM from 'react-dom'
import Web3Status from 'components/Web3Status'
import WalletModal, { useInitConnect } from 'components/WalletModal'
import React, { Suspense, useContext, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Web3ContextProvider, { TassContextType, Web3TassContext } from '../context/web3_tass'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal, useWalletModalToggle } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import Earn from './Earn'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Vote from './Vote'
import VotePage from './Vote/VotePage'

// Initialize provider
import Fortmatic from 'fortmatic'
import { SUPPORTED_WALLETS } from '../constants'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

const ConnectorPortal: React.FC = ({ children }) => {
  if (document.getElementById('react_connector_root')) {
    return ReactDOM.createPortal(children, document.getElementById('react_connector_root') as any)
  } else return <></>
}

const PoolPortal: React.FC = ({ children }) => {
  if (document.getElementById('react_pool_root')) {
    return ReactDOM.createPortal(children, document.getElementById('react_pool_root') as any)
  } else return <></>
}

const SwapPortal: React.FC = ({ children }) => {
  if (document.getElementById('react_swap_root')) {
    return ReactDOM.createPortal(children, document.getElementById('react_swap_root') as any)
  } else return <></>
}

export default function App() {
  const { showWeb3, balance, address } = useContext(Web3TassContext) as TassContextType
  const toggleWalletModal = useWalletModalToggle()

  const handleChangeWallet = () => toggleWalletModal()

  const connector = useInitConnect(() => {
    const selectedConnector = localStorage.getItem('selectedConnector')
    console.log(1111111111111111, selectedConnector)
    // console.log('hello',selectedConnector)
    // return SUPPORTED_WALLETS[selectedConnector].connector;
    // return SUPPORTED_WALLETS.WALLET_CONNECT.connector
    if (!selectedConnector) return
    const walletKey = Object.entries(SUPPORTED_WALLETS)
      .map(([key, value]) => {
        if (value.name === selectedConnector) return key
      })
      .filter(e => {
        if (e === undefined) return false
        else return true
      })

    if (walletKey && walletKey.length !== 0) return SUPPORTED_WALLETS[(walletKey as any)[0]].connector
    else return undefined
    // SUPPORTED_WALLETS.WALLET_CONNECT as any
  })

  console.log('rerender')
  return (
    <Suspense fallback={null}>
      {/* <Web3ContextProvider> */}
      {/* <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} /> */}
      {/* <AppWrapper> */}
      {/* <URLWarning /> */}
      {/* <HeaderWrapper>
          <Header />
        </HeaderWrapper> */}
      {/* <BodyWrapper> */}
      <Popups />

      <Polling />
      <TopLevelModals />
      <Web3ReactManager>
        <Web3Status show={false} />
      </Web3ReactManager>

      {/* connector refactor */}
      <ConnectorPortal>
        <div
          style={
            !showWeb3
              ? {
                  display: 'none'
                }
              : {}
          }
        >
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>

          <Web3ReactManager>
            <Web3Status show={false} />
          </Web3ReactManager>
        </div>
        {!showWeb3 && (
          <div>
            <button className="tass-balance">{balance} ETH</button>
            <button className="tass-connector" onClick={handleChangeWallet}>
              {address}
            </button>
          </div>
        )}
      </ConnectorPortal>
      {/* connector refactor */}

      {/* <Switch> */}

      {/* POOOL REFACTOR */}

      <PoolPortal>
        <Switch>
          <Route exact strict path="/" component={Pool} />
          <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
          <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
          <Route exact strict path="/find" component={PoolFinder} />
          <Route exact strict path="/uni" component={Earn} />
          <Route exact strict path="/vote" component={Vote} />
          <Route exact strict path="/create" component={RedirectToAddLiquidity} />
          <Route exact path="/add" component={AddLiquidity} />
          <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
          <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
          <Route exact path="/create" component={AddLiquidity} />
          <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
          <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
        </Switch>
      </PoolPortal>

      <SwapPortal>
        <Switch>
          <Route exact strict path="/" component={Swap} />

          <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
          <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
          <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
          <Route exact strict path="/migrate/v1" component={MigrateV1} />
          <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
          <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
          <Route exact strict path="/vote/:id" component={VotePage} />
          {/* <Route component={RedirectPathToSwapOnly} /> */}
        </Switch>
      </SwapPortal>

      <Marginer />
      {/* </Switch> */}
      {/* </BodyWrapper> */}
      {/* </AppWrapper> */}
      {/* </Web3ContextProvider> */}
    </Suspense>
  )
}

export function Connector() {
  const { showWeb3 } = useContext(Web3TassContext) as any
  console.log(showWeb3)
  return (
    <Suspense fallback={null}>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      {showWeb3 && (
        <Web3ReactManager>
          <Web3Status show={false} />
        </Web3ReactManager>
      )}
    </Suspense>
  )
}

export function Poole() {
  return (
    <Suspense fallback={null}>
      <Web3ReactManager>
        <Web3Status show={false} />
      </Web3ReactManager>

      <Switch>
        <Route exact strict path="/" component={Pool} />

        <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
        <Route exact strict path="/send" component={RedirectPathToSwapOnly} />

        <Route exact strict path="/find" component={PoolFinder} />

        <Route exact strict path="/uni" component={Earn} />
        <Route exact strict path="/vote" component={Vote} />
        <Route exact strict path="/create" component={RedirectToAddLiquidity} />
        <Route exact path="/add" component={AddLiquidity} />
        <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
        <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
        <Route exact path="/create" component={AddLiquidity} />
        <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
        <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
      </Switch>
    </Suspense>
  )
}
