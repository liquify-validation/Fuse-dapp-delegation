import React from 'react'
import { NavigationLinks } from '../NavigationLinks'
import NetworkInfo from '../NetworkInfo'

export const MobileMenuLinks = ({ onClick, networkBranch, onNetworkChange }) => {
  return (
    <div className={`hd-MobileMenuLinks hd-MobileMenuLinks-${networkBranch}`} onClick={onClick}>
      <NavigationLinks networkBranch={networkBranch} />
      <NetworkInfo networkBranch={networkBranch} onChange={onNetworkChange} />
    </div>
  )
}
