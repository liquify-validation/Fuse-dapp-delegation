import React from 'react'
import { IconMobileMenu } from '../IconMobileMenu'
import { Logo } from '../Logo'
import { MobileMenuLinks } from '../MobileMenuLinks'
import { NavigationLinks } from '../NavigationLinks'
import NetworkInfo from '../NetworkInfo'

export const Header = ({
  baseRootPath = '',
  injectedWeb3,
  netId,
  networkBranch = undefined,
  onChange,
  onMenuToggle,
  showMobileMenu = false
}) => {
  return (
    <header className={`sw-Header sw-Header-${networkBranch} ${showMobileMenu ? 'sw-Header-menu-open' : ''}`}>
      {showMobileMenu ? (
        <MobileMenuLinks networkBranch={networkBranch} onClick={onMenuToggle} onNetworkChange={onChange} />
      ) : null}
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={baseRootPath} />
        <div className="sw-Header_Links">
          <NavigationLinks networkBranch={networkBranch} />
        </div>
        <NetworkInfo networkBranch={networkBranch} onChange={onChange} />
        <IconMobileMenu networkBranch={networkBranch} isOpen={showMobileMenu} onClick={onMenuToggle} />
      </div>
    </header>
  )
}
