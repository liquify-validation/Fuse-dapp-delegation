import React, { Component } from 'react'
import Web3 from 'web3'
import helpers from '../../utils/helpers'
import { PhysicalAddressValue } from '../PhysicalAddressValue'
import { ValidatorDataPair } from '../ValidatorDataPair'
import { ValidatorTitle } from '../ValidatorTitle'
import FuseConsensus from '../../contracts/fuseConsensus.contract'

// .button {
//   background-color: #008CBA;
//   border: none;
//   color: white;
//   padding: 8px 8px;
//   text-align: center;
//   text-decoration: none;
//   display: inline-block;
//   font-size: 16px;
//   margin: 2px 2px;
//   width: 85px;
//   height: 50px;
//   border-radius: 20px;
//   cursor: pointer;
// }

class Validator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: null
    }
  }

  displayIncorectNet() {
    // prettier-ignore
    if (window.confirm('You are not currently connected to the Fuse network, please switch the current provider.\n\nDo you need instructions on how to do this?')) 
    {
      var win = window.open('https://docs.fuse.io/the-fuse-studio/getting-started/how-to-add-fuse-to-your-metamask', '_blank')
      win.focus()
    }
  }

  async withdrawFromVal(val) {
    var fuseInstance = new FuseConsensus()

    if (window.ethereum) {
      try {
        await window.ethereum.enable()
      } catch (e) {
        alert('Error: You denined access to account')
        //throw Error(messages.userDeniedAccessToAccount)
        return
      }
    } else {
      alert('No Metamask (or other Web3 Provider) installed!')
      return
    }
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()

    var netId = await web3.eth.net.getId()
    if (netId !== 122) {
      this.displayIncorectNet()
      return
    }

    await fuseInstance.init({ web3 })

    var amountStaked = await fuseInstance.getValInfo(val, accounts[0])
    var yourStake = amountStaked.YOUR

    if (yourStake === 0) {
      alert('You have nothing staked to ' + val)
      return
    }

    // prettier-ignore
    do {
      var input = window.prompt("How much would you like to withdraw from " + val + "\n\n you have = " + yourStake.toString() + "Fuse staked")
      var selection = parseFloat(input, 10);
    }while((isNaN(selection) && isNaN(input)) || selection > yourStake || selection < 0);

    if (isNaN(selection) && !isNaN(input)) {
      alert('invalid input!')
      return
    } else if (isNaN(input)) {
      alert('canceled')
      return
    }

    var abiEncoded = await fuseInstance.generateWithdrawral(val, selection)

    var contract_address = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79'

    // prettier-ignore
    var transactionObject = {
      'from' : accounts[0],
      'to' : contract_address,
      'value' : 0,
      'data' : abiEncoded
    }

    var gasLimit = await web3.eth.estimateGas(transactionObject)

    transactionObject.gas = gasLimit
    transactionObject.value = 0

    web3.eth.sendTransaction(transactionObject, (err, transactionId) => {
      if (err) {
        console.log('Withdraw failed', err)
        alert('Withdraw failed ' + err.message)
      } else {
        if (window.confirm('Withdraw sent\n\nWould you like to check it on the explorer?')) {
          var url = 'https://explorer.fuse.io/tx/'
          var tranactionURL = url.concat(transactionId.toString())
          var win = window.open(tranactionURL, '_blank')
          win.focus()
        }
      }
    })

    console.log('withdraw from val')
  }

  async delegateToVal(val) {
    this.state.showPopup = true
    if (window.ethereum) {
      try {
        await window.ethereum.enable()
      } catch (e) {
        alert('Error: You denined access to account')
        //throw Error(messages.userDeniedAccessToAccount)
        return
      }
    } else {
      alert('No Metamask (or other Web3 Provider) installed!')
      return
    }
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()

    var netId = await web3.eth.net.getId()
    if (netId !== 122) {
      this.displayIncorectNet()
      return
    }

    var balance = await web3.eth.getBalance(accounts[0])
    var balanceStr = (balance / 10 ** 18).toFixed(2)

    // prettier-ignore
    do{
      var input = window.prompt("How much would you like to stake to " + val + "\n\n your balance = " + balanceStr.toString(), "")
      var selection = parseFloat(input, 10);
    }while((isNaN(selection) && isNaN(input)) || selection > balanceStr || selection < 0.1);

    if (isNaN(selection) && !isNaN(input)) {
      alert('invalid input!')
      return
    } else if (isNaN(input)) {
      alert('canceled')
      return
    }

    var gasPrice = 1 * 10 ** 9
    var contract_address = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79'

    var delegateAmount = selection * 10 ** 18

    var abiEnc = '0x5c19a95c000000000000000000000000' + val.substring(2)

    // prettier-ignore
    var transactionObject = {
      'from' : accounts[0],
      'to' : contract_address,
      'value' : delegateAmount,
      'data' : abiEnc
    }

    var gasLimit = await web3.eth.estimateGas(transactionObject)
    var transactionFee = gasPrice * gasLimit

    if (delegateAmount + transactionFee + 0.1 * 10 ** 18 > balance) {
      delegateAmount = balance - transactionFee - 0.1 * 10 ** 18
    }

    transactionObject.gas = gasLimit
    transactionObject.value = delegateAmount

    web3.eth.sendTransaction(transactionObject, (err, transactionId) => {
      if (err) {
        console.log('Payment failed', err)
        alert('Payment failed ' + err.message)
      } else {
        if (window.confirm('Transaction sent\n\nWould you like to check it on the explorer?')) {
          var url = 'https://explorer.fuse.io/tx/'
          var tranactionURL = url.concat(transactionId.toString())
          var win = window.open(tranactionURL, '_blank')
          win.focus()
        }
      }
    })
  }

  // prettier-ignore
  render() 
  {
    let {
      address,
      children,
      contactEmail,
      createdDate,
      validatorFee,
      firstName,
      index,
      isCompany,
      lastName,
      stakedAmount,
      netId,
      networkBranch,
      physicalAddresses,
      delegatedAmount,
      upTime
    } = this.props

    if (helpers.isCompanyAllowed(netId) && !createdDate) {
      isCompany = true
    }

    var delegateBtn = false

    var companyNameSet = false

    if(delegatedAmount !== '0.00' && delegatedAmount !== 'Metamask not set') {
      delegateBtn = true
    }

    if(firstName !== 'Not set') {
      companyNameSet = true
    }

    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'
    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address
    const fullName = isCompany ? firstName : `${firstName} ${lastName}`
    const titleFirstColumn = isCompany ? 'Company' : 'Notary'
    const titleSecondColumn = isCompany ? '' : 'Notary license'
    const confirmedAddresses = physicalAddresses.filter(a => a.isConfirmed)
    const unconfirmedAddresses = physicalAddresses.filter(a => !a.isConfirmed)
    const addresses = confirmedAddresses.concat(unconfirmedAddresses)

    // prettier-ignore
    return (
      <div className="vl-Validator">
        <div className="vl-Validator_Header">
          <div className="vl-Validator_AddressAndHint">
            <div className="vl-Validator_HeaderAddress">{indexAndAddress}</div>
            <div className="vl-Validator_HeaderHint">Wallet Address</div>
          </div>
        </div>
        <div className="vl-Validator_Body">
          <div className={`vl-Validator_Column`}>
          {!companyNameSet ? null :
            <ValidatorTitle
              networkBranch={networkBranch}
              text={fullName}
              type={isCompany ? 'company' : 'notary'}
              email={contactEmail}
              website={createdDate}
            />
          }
            <div className="vl-Validator_InfoList">
              <ValidatorDataPair data={['Total Stake', stakedAmount]} />
              <ValidatorDataPair data={['Validator Fee', validatorFee]} />
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
          {!companyNameSet ? null :
            <ValidatorTitle
              networkBranch={networkBranch}
              text={titleSecondColumn}
              type={isCompany ? '' : 'notaryLicense'}
            />
          }
            <div className="vl-Validator_InfoList">
              <ValidatorDataPair data={['Delegated', delegatedAmount]} />
              <ValidatorDataPair data={['Uptime', upTime]} />
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
            <div className="vl-Validator_InfoList">
              <button onClick={() => {this.delegateToVal(address)}} className="vl-button">Delegate</button>
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
            <div className="vl-Validator_InfoList">
              {delegateBtn ? <button onClick={() => {this.withdrawFromVal(address)}} className="vl-button-with">Withdraw</button> : null}
            </div>
          </div>
        </div>
        {children ? <div className="vl-Validator_Footer">{children}</div> : null}
      </div>
    )
  }
}
export default Validator
