import React, { createContext, useState } from 'react'

export interface TassContextType {
  showWeb3: boolean
  setShowWeb3: React.Dispatch<React.SetStateAction<boolean>>
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  balance: number
  setBalance: React.Dispatch<React.SetStateAction<number>>
}

export const Web3TassContext = createContext<TassContextType | null>(null)

// export const useWeb3View = (value?: boolean) => {
//   const [showWeb3, setShowWeb3] = useState(value ?? false)
//   return {
//     showWeb3,
//     setShowWeb3
//   }
// }
const Web3ContextProvider: React.FC = ({ children }) => {
  // tass account address
  // tass account balance
  // is logged in using tass
  // data sharing using the context

  const [showWeb3, setShowWeb3] = useState(true)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)
  return (
    <Web3TassContext.Provider
      value={{
        showWeb3,
        setShowWeb3: setShowWeb3,
        address,
        setAddress,
        balance,
        setBalance
      }}
    >
      {children}
    </Web3TassContext.Provider>
  )
}

export default Web3ContextProvider
