/* eslint-disable no-unexpected-multiline */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Validator from '../Validator'
import { Loading } from '../Loading'
import { MainTitle } from '../MainTitle'

export default class AllValidators extends Component {
  constructor(props) {
    super(props)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.state = {
      validators: [],
      loading: true
    }
    this.getValidatorsData.call(this)
  }
  componentWillMount() {
    const { props } = this
    const { web3Config } = props
    const { netId } = web3Config

    this.setState({ loading: true, netId: netId })
  }
  async getValidatorsData() {
    const netId = this.props.web3Config.netId
    this.getMetadataContract()
      [this.props.methodToCall](netId)
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          data[i].index = i + 1
        }
        return this.augmentValidatorsWithPhysicalAddress(data)
      })
      .then(augmentedValidators => {
        this.setState({
          validators: augmentedValidators,
          loading: false,
          reload: false,
          netId
        })
      })
  }
  async augmentValidatorsWithPhysicalAddress(validators) {
    let augmentedValidators = []

    // If an error ocurred or PoPA is not available, fallback to mapping the physical address from the validator's metadata
    // without confirmed/unconfirmed information
    augmentedValidators = validators.map(validator => ({
      ...validator,
      physicalAddresses: [
        {
          upTime: validator.upTime,
          us_state: validator.us_state,
          postal_code: validator.postal_code
        }
      ]
    }))
    return augmentedValidators
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.web3Config.netId !== this.state.netId) {
      this.getValidatorsData.call(this)
      return false
    }
    return true
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  render() {
    const { networkBranch } = this.props
    const filtered = this.state.validators.filter((validator, index) => {
      return Object.values(validator)
        .join(' ')
        .replace(/ +(?= )/g, '')
        .toLowerCase()
        .includes(this.props.searchTerm.toLowerCase())
    })

    let validators = []
    let delegateButton = this.props.delegateButton

    for (let [index, validator] of filtered.entries()) {
      let childrenWithProps = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { miningkey: validator.address })
      })
      var pushVal = true

      // prettier-ignore
      if (delegateButton === true && (validator.delegatedAmount === '0.00' || validator.delegatedAmount === '' || validator.delegatedAmount === 'Metamask not set')) {
        pushVal = false
      }

      if (pushVal) {
        validators.push(
          <Validator
            address={validator.address}
            contactEmail={validator.contactEmail}
            createdDate={validator.createdDate}
            validatorFee={validator.validatorFee}
            firstName={validator.firstName}
            upTime={validator.upTime}
            index={validator.index}
            isCompany={validator.isCompany}
            key={index}
            lastName={validator.lastName}
            stakedAmount={validator.stakedAmount}
            metadataContract={this.props.web3Config.metadataContract}
            methodToCall={this.props.methodToCall}
            netId={this.state.netId}
            networkBranch={networkBranch}
            physicalAddresses={validator.physicalAddresses}
            postal_code={validator.postal_code}
            delegatedAmount={validator.delegatedAmount}
            us_state={validator.us_state}
          >
            {childrenWithProps}
          </Validator>
        )
      }
    }
    const isValidatorsPage = this.props.methodToCall === 'getAllValidatorsData'
    var validatorsCount = isValidatorsPage
      ? `Total number of validators: <strong>${this.state.validators.length}</strong>`
      : ''
    if (isValidatorsPage) {
      var staked = 0
      for (let key of this.state.validators) {
        staked += parseFloat(key.stakedAmount)
      }
      validatorsCount += `, Total Fuse staked to validators: <strong>${staked}</strong>`
    }

    return this.state.loading ? (
      ReactDOM.createPortal(<Loading networkBranch={networkBranch} />, document.getElementById('loadingContainer'))
    ) : (
      <div className="vl-AllValidators">
        <MainTitle text={this.props.viewTitle} extraText={validatorsCount} />
        {validators.length ? validators : <p>No content to display.</p>}
      </div>
    )
  }
}
