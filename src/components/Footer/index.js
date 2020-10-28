import React from 'react'
import moment from 'moment'
import { Logo } from '../Logo'
import { SocialIcons } from '../SocialIcons'

export const Footer = ({ baseRootPath = '', extraClassName = '', networkBranch = false }) => {
  return (
    <footer className={`sw-Footer ${extraClassName}  sw-Footer-${networkBranch}`}>
      <div className="sw-Footer_Content">
        <Logo networkBranch="footer" href={baseRootPath} />
        <p className="sw-Footer_Text">
          {moment().format('YYYY')} ©Fuse. A permissionless and border-less public ledger designed for easy integration
          of everyday payments.
        </p>
        <SocialIcons networkBranch={networkBranch} />
      </div>
    </footer>
  )
}
