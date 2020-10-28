import React from 'react'
import { LogoFuse, LogoFuseFooter } from '../LogoFuse'

export const Logo = ({ href = null, extraClass = '', networkBranch = '' }) => {
  switch (networkBranch) {
    case 'footer':
      return <LogoFuseFooter href={href} extraClass={extraClass} />
      break
    default:
      return <LogoFuse href={href} extraClass={extraClass} />
  }
}
