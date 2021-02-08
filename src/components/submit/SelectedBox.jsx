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

    // event handlers
    this.removePerson = this.removePerson.bind(this)
  }

  removePerson(e) {
    let id = e.target.id
    let index = id.substring(id.lastIndexOf('-') + 1)
    console.log('removePerson', this.props.items[index].misc_id)
    this.props.removePerson(this.props.items[index].misc_id)
  }

  renderItems(items, current) {
    console.log(items.find(person => person.misc_id === current))
    let itemsArray = []
    items.forEach((item, i) => {
      let border = 'null'
      if (item.misc_id === current) {
        border = 'danger'
      }
      itemsArray.push(
        <Card className="row flex-row align-items-center flex-nowrap mx-1 pr-3" 
          bg="light" text="dark" border={border} key={`selected-${i}`}>
          <div>
            <Image className="mr-1" width="40px" height="40px" roundedCircle src={item.thumbnail} />
          </div>
          <div className="mx-1 d-flex flex-column text-truncate">
            <strong>
              {item.name}
            </strong>
            <span>
              <i>
                {item.roles ? item.roles.join(',') : 'no roles yet.'}
              </i>
            </span>
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
