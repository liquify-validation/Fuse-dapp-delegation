import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { ValidatorTitle } from '../ValidatorTitle'
import 'react-tabs/style/react-tabs.css'

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

class ValidatorGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: null
    }
  }

  // prettier-ignore
  render() 
  {
    let {
      array
    } = this.props

    var numberOfNodes = array.length

    if (numberOfNodes > 10) {
      numberOfNodes = 10
    }

    const name = array[0].props.firstName
    const contactEmail = array[0].props.contactEmail
    const createdDate = array[0].props.createdDate

    return (
      <div className="vl-Validator">
        <div className="vl-Validator_Header">
          <div className="vl-Validator_AddressAndHint">
            <div className="vl-Validator_HeaderAddress">
              
            <ValidatorTitle
              networkBranch='core'
              text={name}
              type='company'
              email={contactEmail}
              website={createdDate}
            />
            </div>
          </div>
        </div>
      <Tabs>
        <TabList>
          <Tab>Node 1</Tab>
          {numberOfNodes > 1 && 
            <Tab>Node 2</Tab>
          }
          {numberOfNodes > 2 && 
            <Tab>Node 3</Tab>
          }
          {numberOfNodes > 3 && 
            <Tab>Node 4</Tab>
          }
          {numberOfNodes > 4 && 
            <Tab>Node 5</Tab>
          }
          {numberOfNodes > 5 && 
            <Tab>Node 6</Tab>
          }
          {numberOfNodes > 6 && 
            <Tab>Node 7</Tab>
          }
          {numberOfNodes > 7 && 
            <Tab>Node 8</Tab>
          }
          {numberOfNodes > 8 && 
            <Tab>Node 9</Tab>
          }
          {numberOfNodes > 9 && 
            <Tab>Node 10</Tab>
          }
        </TabList>

        <TabPanel>
          <h2>{array[0]}</h2>
        </TabPanel>
        {numberOfNodes > 1 && 
          <TabPanel>
            <h2>{array[1]}</h2>
          </TabPanel>
        }
        {numberOfNodes > 2 && 
          <TabPanel>
            <h2>{array[2]}</h2>
          </TabPanel>
        } 
        {numberOfNodes > 3 && 
          <TabPanel>
            <h2>{array[3]}</h2>
          </TabPanel>
        } 
        {numberOfNodes > 4 && 
          <TabPanel>
            <h2>{array[4]}</h2>
          </TabPanel>
        }
        {numberOfNodes > 5 && 
          <TabPanel>
            <h2>{array[5]}</h2>
          </TabPanel>
        }
        {numberOfNodes > 6 && 
          <TabPanel>
            <h2>{array[6]}</h2>
          </TabPanel>
        } 
        {numberOfNodes > 7 && 
          <TabPanel>
            <h2>{array[7]}</h2>
          </TabPanel>
        } 
        {numberOfNodes > 8 && 
          <TabPanel>
            <h2>{array[8]}</h2>
          </TabPanel>
        }
        {numberOfNodes > 9 && 
          <TabPanel>
            <h2>{array[9]}</h2>
          </TabPanel>
        }   
      </Tabs>
      </div>
    )
  }
}
export default ValidatorGroup
