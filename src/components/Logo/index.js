import React from 'react'
import { LogoFuse } from '../LogoFuse'
import { constants } from '../../utils/constants'

export const Logo = ({ href = null, extraClass = '', networkBranch = '' }) => {
  switch (networkBranch) {
    default:
      return <LogoFuse href={href} extraClass={extraClass} />
  }
}
