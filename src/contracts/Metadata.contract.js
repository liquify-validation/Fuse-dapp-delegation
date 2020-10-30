/* eslint-disable no-throw-literal */
import FuseConsensus from './fuseConsensus.contract'
import Web3 from 'web3'

export default class Metadata {
  async init({ web3, netId, addresses }) {
    this.web3 = web3
    this.netId = Number(netId)
    this.gasPrice = web3.utils.toWei('1', 'gwei')

    this.addresses = addresses
    var t0 = performance.now()
    this.nodes = await fetch('http://95.216.161.92:5000//downbot/api/v0.1/nodes')
    this.nodes = await this.nodes.json()
    var t1 = performance.now()
    console.log('time grab val data from downbot ' + (t1 - t0) + ' milliseconds.')

    this.fuseInstance = new FuseConsensus()
    await this.fuseInstance.init({ web3 })
    this.miningKeys = await this.fuseInstance.getValidators()
    this.useMetaMask = false

    if (window.ethereum) {
      try {
        await window.ethereum.enable()
        this.metaMask = new Web3(window.ethereum)
        this.netId = await this.metaMask.eth.net.getId()
        this.useMetaMask = true
      } catch (e) {
        alert('Error: You denined access to account your delegation wont be shown')
        this.useMetaMask = false
        //throw Error(messages.userDeniedAccessToAccount)
        return
      }
    } else {
      alert('No Metamask (or other Web3 Provider) installed! your delegation wont be shown')
      this.useMetaMask = false
      return
    }
  }

  async getValidatorData(miningKey) {
    if (!miningKey) {
      return {}
    }

    if (typeof this.nodes[miningKey].name === 'undefined') {
      return {}
    }

    var addr = ''
    if (this.useMetaMask && this.netId === 122) {
      var account = await this.metaMask.eth.getAccounts()
      addr = account[0]
    }

    var validatorDict = await this.fuseInstance.getValInfo(miningKey, addr)
    var fee = validatorDict.FEE[0]
    // prettier-ignore
    let stakedAmount = validatorDict.TOTAL[0].toFixed(2).toString()
    var delegatedAmount = ''
    // prettier-ignore
    if ( addr !== '') {
      delegatedAmount = validatorDict.YOUR[0].toFixed(2).toString()
    } else {
      delegatedAmount = 'Metamask not set'
    }
    // prettier-ignore
    let validatorFee = fee.toString() + '%'

    let contactEmail = typeof this.nodes[miningKey].email !== 'undefined' ? this.nodes[miningKey].email : 'Not set'
    let firstName = typeof this.nodes[miningKey].name !== 'undefined' ? this.nodes[miningKey].name : 'Not set'
    let createdDate = typeof this.nodes[miningKey].website !== 'undefined' ? this.nodes[miningKey].website : 'Not set'
    // prettier-ignore
    let upTime = typeof this.nodes[miningKey].upTime !== 'undefined' ? (this.nodes[miningKey].upTime * 100).toFixed(2).toString() + '%' : 'Not set'
    let isCompany = true
    return {
      firstName,
      lastName: 'you',
      upTime,
      createdDate,
      delegatedAmount,
      validatorFee,
      stakedAmount,
      us_state: 'N/A',
      postal_code: 'N/A',
      contactEmail,
      isCompany
    }
  }

  async getUserAsync(miningKey) {
    let response = await fetch(`'http://95.216.161.92:5000//downbot/api/v0.1/node=${miningKey}`, { mode: 'no-cors' })
    let data = await response.json()
    return data
  }

  async getAllValidatorsData(netId) {
    let all = []
    return new Promise(async (resolve, reject) => {
      var t0 = performance.now()
      for (let key of this.miningKeys) {
        let data = await this.getValidatorData(key)
        if (typeof data.isCompany !== 'undefined') {
          data.address = key
          all.push(data)
        }
      }
      resolve(all)
      var t1 = performance.now()
      console.log('time to pull all validator info ' + (t1 - t0) + ' milliseconds.')
    })
  }
}
