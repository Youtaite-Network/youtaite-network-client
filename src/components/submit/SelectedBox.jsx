import React from 'react'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { MdClear } from 'react-icons/md'
import './SelectedBox.css'

class SelectedBox extends React.Component {
  constructor(props) {
    super(props)
    // PROPS
    // items
    // current
    // removePerson
    // removeRole

    // event handlers
    this.removePerson = this.removePerson.bind(this)
    this.removeRole = this.removeRole.bind(this)
  }

  removePerson(e) {
    let id = e.target.id
    let index = id.substring(id.lastIndexOf('-') + 1)
    this.props.removePerson(this.props.items[index].misc_id)
  }

  removeRole(e) {
    let idSplit = e.target.id.split('-')
    let personIndex = idSplit[3]
    let role = idSplit[4]
    this.props.removeRole(this.props.items[personIndex].misc_id, role)
  }

  renderItems(items, current) {
    let itemsArray = []
    items.forEach((item, i) => {
      let border = 'null'
      if (item.misc_id === current) {
        border = 'danger'
      }
      itemsArray.push(
        <Card className="row flex-row align-items-center flex-nowrap m-1 pr-3" 
          bg="light" text="dark" border={border} key={`selected-${i}`}>
          <div>
            <Image className="m-1" width="40px" height="40px" roundedCircle src={item.thumbnail} />
          </div>
          <div className="mx-1 d-flex flex-column text-truncate">
            <strong>
              {item.name}
            </strong>
            <div class="d-flex">
              {this.renderRoles(item.roles, i)}
            </div>
          </div>
          <Button id={`rm-person-btn-${i}`} type="button" variant="outline-danger" 
            className="rm-person-btn d-flex align-items-center p-0 h-100"
            onClick={this.removePerson}>
            <MdClear />
          </Button>
        </Card>
      )
    })
    return itemsArray
  }

  renderRoles(roles, personIndex) {
    let rolesArray = []
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        rolesArray.push(
          <div className="role-card d-flex">
            <i>{`${role},`}</i>
            <Button id={`rm-role-btn-${personIndex}-${role}`} 
              className="rm-role-btn m-0 p-0" variant="outline-danger" 
              onClick={this.removeRole}>
              <MdClear className="mt-n1" />
            </Button>
          </div>
        )
      })
    } else {
      rolesArray.push(
        <div className="role-card d-flex" bg="light">
          <i>no roles.</i>
        </div>
      )
    }
    return rolesArray
  }

  render() {
    const itemsArray = this.renderItems(this.props.items, this.props.current)

    return (
      <Card bg="light" className={'mb-3 ' + (itemsArray.length > 0 ? '' : 'd-none')}>
        <Card.Header>Selected people:</Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {itemsArray}
          </div>
        </Card.Body>
      </Card>
    )
  }
}

export default SelectedBox
