import helpers from './helpers'
import { constants } from '../utils/constants'
const fuseConsensusAbi = require('./Consensus.abi.json')

export default class fuseConsensus {
  async init({ web3, netId, addresses }) {
    // prettier-ignore
    const CONSENSUS_ADDRESS = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79'

    this.instance = new web3.eth.Contract(fuseConsensusAbi, CONSENSUS_ADDRESS)
  }
  async getValidators() {
    console.log(this.instance)
    return await this.instance.methods.getValidators().call()
  }
  async isMasterOfCeremonyRemoved() {
    if (this.instance.methods.isMasterOfCeremonyRemoved) {
      return await this.instance.methods.isMasterOfCeremonyRemoved().call()
    }
    return false
  }
}
