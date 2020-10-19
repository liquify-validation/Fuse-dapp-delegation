import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import helpers from './utils/helpers'
import { ButtonConfirm } from './components/ButtonConfirm'
import { CreateKeysAddressNote } from './components/CreateKeysAddressNote'
import { FormAutocomplete } from './components/FormAutocomplete'
import { FormInput } from './components/FormInput'
import { FormRadioButton } from './components/FormRadioButton'
import { Loading } from './components/Loading'
import { MainTitle } from './components/MainTitle'
import { constants } from './utils/constants'
import ReactHtmlParser from 'react-html-parser'
import messages from './utils/messages'

import './assets/stylesheets/index.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.setMetadata = this.setMetadata.bind(this)
    this.onChangeAutoComplete = address => {
      const form = this.state.form
      form.fullAddress = address
      this.setState({ form })
    }
    this.state = {
      web3Config: {},
      form: {
        fullAddress: '',
        validatorFee: '',
        postal_code: '',
        us_state: '',
        firstName: '',
        lastName: '',
        stakedAmount: '',
        contactEmail: '',
        isCompany: helpers.isCompanyAllowed(Number(this.props.web3Config.netId))
      },
      hasData: false,
      loading: true
    }
    this.defaultValues = null
  }
  render() {
    const netId = Number(this.props.web3Config.netId)
    const { isCompany } = this.state.form
    const { networkBranch } = this.props
    const hideNote = netId !== helpers.netIdByBranch(constants.branches.CORE)
    const isCompanyAllowed = helpers.isCompanyAllowed(netId)
    const inputProps = {
      id: 'address',
      onChange: this.onChangeAutoComplete,
      value: this.state.form.fullAddress
    }
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="vld-App_FormAutocompleteItem">
        <strong>{formattedSuggestion.mainText}</strong> <small>{formattedSuggestion.secondaryText}</small>
      </div>
    )

    if (this.state.loading) {
      return ReactDOM.createPortal(
        <Loading networkBranch={networkBranch} />,
        document.getElementById('loadingContainer')
      )
    }

    let error

    if (!this.props.web3Config.injectedWeb3) {
      error = messages.noMetamaskFound
    } else if (!this.props.web3Config.votingKey) {
      error = messages.noMetamaskAccount
    } else if (!this.props.web3Config.networkMatch) {
      error = messages.networkMatchError(netId)
    } else if (!this.props.web3Config.isValidVotingKey) {
      error = messages.invalidaVotingKey
    }

    return (
      <div className="vld-App">
        <MainTitle text={constants.navigationData[1].title} />
        {error ? (
          <p>{ReactHtmlParser(error)}</p>
        ) : (
          <div>
            {isCompanyAllowed ? (
              <div className="vld-App_RadioButtons">
                <FormRadioButton
                  checked={isCompany}
                  id="isCompany"
                  name="isCompanyRadio"
                  networkBranch={networkBranch}
                  onChange={this.onChangeFormField}
                  text="I'm a company"
                />
                <FormRadioButton
                  checked={!isCompany}
                  id="isNotary"
                  name="isCompanyRadio"
                  networkBranch={networkBranch}
                  onChange={this.onChangeFormField}
                  text="I'm a notary"
                />
              </div>
            ) : null}
            <form className="vld-App_Form">
              <FormInput
                id="firstName"
                onChange={this.onChangeFormField}
                title={isCompany ? 'Full name' : 'First name'}
                value={this.state.form.firstName}
              />
              {isCompany ? (
                <FormInput
                  id="contactEmail"
                  onChange={this.onChangeFormField}
                  title="Contact E-mail"
                  type="email"
                  value={this.state.form.contactEmail}
                />
              ) : null}
              {isCompany ? null : (
                <FormInput
                  id="lastName"
                  onChange={this.onChangeFormField}
                  title="Last name"
                  value={this.state.form.lastName}
                />
              )}
              {isCompany ? null : (
                <FormInput
                  id="stakedAmount"
                  onChange={this.onChangeFormField}
                  title="License id"
                  value={this.state.form.stakedAmount}
                />
              )}
              {isCompany ? null : (
                <FormInput
                  id="validatorFee"
                  onChange={this.onChangeFormField}
                  title="License expiration"
                  type="date"
                  value={this.state.form.validatorFee}
                />
              )}
              {isCompany ? null : (
                <FormAutocomplete
                  autocompleteItem={AutocompleteItem}
                  id="address"
                  inputProps={inputProps}
                  onSelect={this.onSelect}
                  title="Address"
                />
              )}
              {isCompany ? null : (
                <FormInput
                  id="us_state"
                  onChange={this.onChangeFormField}
                  title="State"
                  value={this.state.form.us_state}
                />
              )}
              {isCompany ? null : (
                <FormInput
                  id="postal_code"
                  onChange={this.onChangeFormField}
                  title="Zip code"
                  value={this.state.form.postal_code}
                />
              )}
            </form>
            <ButtonConfirm
              networkBranch={networkBranch}
              text={` ${this.state.hasData ? 'Update' : 'Set'} Metadata`}
              onClick={this.onClick}
            />
            {hideNote ? null : <CreateKeysAddressNote networkBranch={networkBranch} />}
          </div>
        )}
      </div>
    )
  }
}

export default App
