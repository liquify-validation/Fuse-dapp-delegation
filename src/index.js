import AllValidators from './components/AllValidators'
import App from './App'
import Metadata from './contracts/Metadata.contract'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import getWeb3 from './utils/getWeb3'
import helpers from './utils/helpers'
import networkAddresses from './contracts/addresses'
import registerServiceWorker from './utils/registerServiceWorker'
import { BaseLoader } from './components/BaseLoader'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Router, Route, Redirect } from 'react-router-dom'
import { SearchBar } from './components/SearchBar'
import { Loading } from './components/Loading'
import { constants } from './utils/constants'
import { getNetworkBranch } from './utils/utils'

const history = createBrowserHistory()
const baseRootPath = '/fuse-dapps-delegation'
const setMetadataPath = `${baseRootPath}/set`

class AppMainRouter extends Component {
  constructor(props) {
    super(props)

    history.listen(this.onRouteChange.bind(this))

    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onNetworkChange = this.onNetworkChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onSetRender = this.onSetRender.bind(this)
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.onAccountChange = this.onAccountChange.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)

    this.state = {
      error: false,
      injectedWeb3: false,
      networkMatch: false,
      loading: true,
      loadingNetworkBranch: null,
      metadataContract: null,
      miningKey: null,
      netId: '',
      poaConsensus: null,
      searchTerm: '',
      showMobileMenu: false,
      showSearch: history.location.pathname !== setMetadataPath,
      votingKey: null,
      isValidVotingKey: false,
      delegateButton: false
    }
    window.addEventListener('load', () => this.initChain())
  }

  initChain() {
    const netId = window.sessionStorage.netId
    getWeb3(netId, this.onAccountChange)
      .then(async web3Config => {
        return networkAddresses(web3Config)
      })
      .then(async config => {
        const { web3Config, addresses } = config
        await this.initContracts({
          web3: web3Config.web3Instance,
          netId: web3Config.netId,
          addresses
        })
        await this.onAccountChange(web3Config.defaultAccount)
        this.setState({
          injectedWeb3: web3Config.injectedWeb3,
          networkMatch: web3Config.networkMatch
        })
        this.setState({ loading: false, loadingNetworkBranch: null })
        this.onRouteChange()
      })
      .catch(error => {
        console.error(error.message)
        this.setState({ loading: false, error: true, loadingNetworkBranch: null })
        helpers.generateAlert('error', 'Error!', error.message)
      })
  }

  async initContracts({ web3, netId, addresses }) {
    const metadataContract = new Metadata()
    await metadataContract.init({
      web3,
      netId,
      addresses
    })
    const newState = {
      metadataContract,
      netId
    }
    this.setState(newState)
  }

  async onAccountChange(votingKey) {
    console.log(`Accounts set`)
  }

  onRouteChange() {
    if (history.location.pathname === setMetadataPath) {
      this.setState({ showSearch: false })
    } else {
      this.setState({ showSearch: true })
    }
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }))
  }

  async _onBtnClick({ event, methodToCall, successMsg }) {
    event.preventDefault()
    this.checkForVotingKey(async () => {
      this.setState({ loading: true })

      const miningKey = event.currentTarget.getAttribute('miningkey')
      try {
        let result = await this.state.metadataContract[methodToCall]({
          miningKeyToConfirm: miningKey,
          senderVotingKey: this.state.votingKey,
          senderMiningKey: this.state.miningKey
        })
        console.log(result)
        this.setState({ loading: false })
        helpers.generateAlert('success', 'Congratulations!', successMsg)
      } catch (error) {
        this.setState({ loading: false })
        console.error(error.message)
        helpers.generateAlert('error', 'Error!', error.message)
      }
    })
  }

  onAllValidatorsRender() {
    const networkBranch = this.getValidatorsNetworkBranch()

    return this.state.loading || this.state.error ? null : (
      <AllValidators
        networkBranch={networkBranch}
        methodToCall="getAllValidatorsData"
        searchTerm={this.state.searchTerm}
        viewTitle={constants.navigationData[0].title}
        web3Config={this.state}
        delegateButton={this.state.delegateButton}
      />
    )
  }

  onSearch(term) {
    this.setState({ searchTerm: term.target.value })
  }

  handleOptionChange(e) {
    if (e.target.checked && !this.state.delegateButton) {
      this.setState({
        delegateButton: true
      })
    } else if (e.target.checked && this.state.delegateButton) {
      this.setState({
        delegateButton: false
      })
    }
  }

  getValidatorsNetworkBranch() {
    return this.state.netId ? getNetworkBranch(this.state.netId) : null
  }

  onSetRender() {
    const networkBranch = this.getValidatorsNetworkBranch()
    return !this.state.loading ? <App web3Config={this.state} networkBranch={networkBranch} /> : null
  }

  onNetworkChange(e) {
    this.setState({ loading: true, loadingNetworkBranch: getNetworkBranch(e.value), searchTerm: '' })
    window.localStorage.netId = e.value
    window.sessionStorage.netId = e.value
    this.initChain()
  }

  render() {
    const networkBranch = this.state.loadingNetworkBranch
      ? this.state.loadingNetworkBranch
      : this.getValidatorsNetworkBranch()

    return networkBranch ? (
      <Router history={history}>
        <div
          className={`lo-AppMainRouter ${!this.state.showSearch ? 'lo-AppMainRouter-no-search-bar' : ''} ${
            this.state.showMobileMenu ? 'lo-AppMainRouter-menu-open' : ''
          }`}
        >
          <Header
            baseRootPath={baseRootPath}
            injectedWeb3={this.state.injectedWeb3}
            netId={this.state.netId}
            networkBranch={networkBranch}
            onChange={this.onNetworkChange}
            onMenuToggle={this.toggleMobileMenu}
            showMobileMenu={this.state.showMobileMenu}
          />
          {this.state.showSearch ? (
            <SearchBar networkBranch={networkBranch} onSearch={this.onSearch} searchTerm={this.state.searchTerm} />
          ) : null}
          <div className="radio">
            <label>
              <input
                checked={this.state.delegateButton}
                onClick={this.handleOptionChange}
                className="form-check-input"
                type="radio"
                value="Click"
              />
              Show only nodes you've delegated too
            </label>
          </div>
          {this.state.loading
            ? ReactDOM.createPortal(
                <Loading networkBranch={networkBranch} />,
                document.getElementById('loadingContainer')
              )
            : null}
          <section
            className={`lo-AppMainRouter_Content lo-AppMainRouter_Content-${networkBranch} ${
              this.state.showMobileMenu ? 'lo-AppMainRouter_Content-mobile-menu-open' : ''
            }`}
          >
            <Route
              exact
              path={`/`}
              render={props => (
                <Redirect
                  to={{
                    pathname: baseRootPath
                  }}
                />
              )}
            />
            <Route exact path={baseRootPath} render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route exact path={setMetadataPath} render={this.onSetRender} />
          </section>
          <Footer baseRootPath={baseRootPath} networkBranch={networkBranch} />
        </div>
      </Router>
    ) : (
      <BaseLoader />
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'))
registerServiceWorker()
