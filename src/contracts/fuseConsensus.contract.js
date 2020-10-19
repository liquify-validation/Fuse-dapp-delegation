const fuseConsensusAbi = require('./Consensus.abi.json')

export default class FuseConsensus {
  async init({ web3 }) {
    // prettier-ignore
    const CONSENSUS_ADDRESS = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79'

    this.instance = new web3.eth.Contract(fuseConsensusAbi, CONSENSUS_ADDRESS)
  }
  async getValidators() {
    return await this.instance.methods.getValidators().call()
  }
  async getTotalStaked() {
    var staked = 0
    var vals = await this.getValidators()
    for (let key of vals) {
      staked += parseInt(await this.instance.methods.stakeAmount(key).call())
    }
    staked = staked / 10 ** 18
    console.log(staked)
    return staked
  }
  async getStakedToVal(val, addr) {
    // prettier-ignore
    var totalStaked = (parseInt(await this.instance.methods.stakeAmount(val).call())) / 10 ** 18
    var yourStake = 0
    if (addr !== '') {
      yourStake = parseInt(await this.instance.methods.delegatedAmount(addr, val).call()) / 10 ** 18
    }

    // prettier-ignore
    return {
      'TOTAL': [totalStaked],
      'YOUR': [yourStake]
    }
  }
  async getFee(val) {
    return (parseInt(await this.instance.methods.validatorFee(val).call()) * 100) / 10 ** 18
  }
  async generateWithdrawral(val, stake) {
    var stakeDecimals = stake * 10 ** 18
    return this.instance.methods.withdraw(val, stakeDecimals).encodeABI()
  }
}
