const fuseConsensusAbi = require('./Consensus.abi.json')

export default class FuseConsensus {
  async init({ web3 }) {
    // prettier-ignore
    const CONSENSUS_ADDRESS = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79'

    this.batch = new web3.BatchRequest()
    this.instance = new web3.eth.Contract(fuseConsensusAbi, CONSENSUS_ADDRESS)
  }

  async getValidators() {
    return await this.instance.methods.getValidators().call()
  }
  async getTotalStaked() {
    var staked = 0
    var t0 = performance.now()
    var vals = await this.getValidators()
    for (let key of vals) {
      staked += parseInt(await this.instance.methods.stakeAmount(key).call())
    }
    staked = staked / 10 ** 18
    console.log(staked)
    var t1 = performance.now()
    console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')
    return staked
  }
  async getValInfo(val, addr) {
    if (addr !== '') {
      let [totalStaked, yourStake, fee] = await this.makeBatchRequest([
        this.instance.methods.stakeAmount(val).call,
        this.instance.methods.delegatedAmount(addr, val).call,
        this.instance.methods.validatorFee(val).call
      ])

      // prettier-ignore
      totalStaked = (parseInt(totalStaked)) / 10 ** 18
      if (addr !== '') {
        yourStake = parseInt(yourStake) / 10 ** 18
      }

      fee = (parseInt(fee) * 100) / 10 ** 18

      // prettier-ignore
      return {
        'TOTAL': [totalStaked],
        'YOUR': [yourStake],
        'FEE': [fee]
      }
    } else {
      let [totalStaked, fee] = await this.makeBatchRequest([
        this.instance.methods.stakeAmount(val).call,
        this.instance.methods.validatorFee(val).call
      ])

      // prettier-ignore
      totalStaked = (parseInt(totalStaked)) / 10 ** 18
      fee = (parseInt(fee) * 100) / 10 ** 18

      // prettier-ignore
      return {
        'TOTAL': [totalStaked],
        'YOUR': [0],
        'FEE': [fee]
      }
    }
  }
  async getFee(val) {
    return (parseInt(await this.instance.methods.validatorFee(val).call()) * 100) / 10 ** 18
  }
  async generateWithdrawral(val, stake) {
    var stakeDecimals = stake * 10 ** 18
    return this.instance.methods.withdraw(val, stakeDecimals).encodeABI()
  }

  makeBatchRequest(calls) {
    let promises = calls.map(call => {
      return new Promise((res, rej) => {
        let req = call.request((err, data) => {
          if (err) rej(err)
          else res(data)
        })
        this.batch.add(req)
      })
    })
    this.batch.execute()

    return Promise.all(promises)
  }
}
