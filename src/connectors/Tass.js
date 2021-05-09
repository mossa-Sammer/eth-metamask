import Axios from 'axios'
import { ethers } from 'ethers'

export class TassConnector {
  apiToken
  chainId
  constructor({ apiToken }) {
    this.chainId = 1
    this.apiToken = apiToken
  }

  static async activate(address = '0xdb28C4e517dc57376E12F3078F0A6caEF4a831eC') {
    const provider = ethers.getDefaultProvider('rinkeby', {
      infura: 'bfe470689d594eca91b81abe8656f209'
    })
    const bal = await provider.getBalance(address)
    console.log(bal / 1000000000000000000)
    return bal / 1000000000000000000
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
