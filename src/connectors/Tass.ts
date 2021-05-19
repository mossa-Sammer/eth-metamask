import Axios from 'axios'
import { ethers } from 'ethers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import Web3ProviderEngine from 'web3-provider-engine'

export class TassConnector2 extends AbstractConnector {
  apiToken: string
  tassProvider: any
  // tassProvider: ethers.providers.BaseProvider | null;
  chainId: number
  account: string | null

  constructor({ apiToken, chainId }: { apiToken: string; chainId: number }) {
    super({
      supportedChainIds: [chainId]
    })

    this.apiToken = apiToken
    this.tassProvider = null
    this.chainId = chainId
    this.account = '0xe63Cd3474b504435c9F44f8b8135deb6459b32C7'
  }

  async activate(): Promise<ConnectorUpdate> {
    const engine = new Web3ProviderEngine({ pollingInterval: 5000 })

    // const provider = ethers.getDefaultProvider('rinkeby', {
    // 	infura: 'https://rinkeby.infura.io/v3/59dc9253491f41b8bc140f5d9d4e53f9'
    // });

    this.tassProvider = engine

    return {
      chainId: this.chainId,
      provider: this.tassProvider
    }
  }

  deactivate() {
    this.tassProvider = null
  }

  async getProvider(): Promise<any> {
    return this.tassProvider
  }

  async getChainId() {
    return this.chainId
  }

  async getAccount() {
    return this.account
  }

  setAccount(acc: string) {
    this.account = acc
  }
  close() {
    this.account = null
    this.tassProvider = null
  }
}

export class TassConnector {
  apiToken: any
  chainId: any
  constructor({ apiToken }: { apiToken: string }) {
    this.chainId = 1
    this.apiToken = apiToken
  }

  static async activate(address = '0xdb28C4e517dc57376E12F3078F0A6caEF4a831eC') {
    const provider = ethers.getDefaultProvider('rinkeby', {
      infura: 'bfe470689d594eca91b81abe8656f209'
    })
    const bal: any = await provider.getBalance(address)
    console.log(bal / 10 ** 18)
    return bal / 10 ** 18

    // call web3 to fetch account balance and display
    // use the infura node
    // const data = await Axios.post(
    //   '/',
    //   {},
    //   {
    //     headers: {
    //       authorization: ''
    //     }
    //   }
    // )

    // providers.

    // const { account, provider } = data as any
  }
}
