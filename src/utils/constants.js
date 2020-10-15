const constants = {}
constants.organization = 'poanetwork'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json',
  ProofOfPhysicalAddress: 'ProofOfPhysicalAddress.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'
constants.rootPath = '/fuse-dapps-delegation'
constants.branches = {
  CORE: 'core'
}

constants.navigationData = [
  {
    icon: 'all',
    title: 'Validators',
    url: constants.rootPath
  }
]

constants.NETWORKS = {
  '122': {
    NAME: 'Core',
    FULLNAME: 'Fuse Network',
    RPC: 'https://rpc.fuse.io',
    BRANCH: constants.branches.CORE,
    SORTORDER: 1
  }
}

module.exports = {
  constants
}
