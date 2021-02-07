import React from 'react'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'

function SelectedBox(props) {
  const items = props.items
  const current = props.current
  console.log(items.find(person => person.misc_id === current))
  let itemsArray = []
  items.forEach((item, i) => {
    let border = 'null'
    if (item.misc_id === current) {
      border = 'danger'
    }
    itemsArray.push(
      <Card className="row flex-row align-items-center flex-nowrap p-1 m-1" 
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
      </Card>
    )
  })
  return (
    <Card bg="light" className={'mb-3 ' + (items.length > 0 ? '' : 'd-none')}>
      <Card.Header>Selected people:</Card.Header>
      <Card.Body>
        <div className="d-flex flex-wrap">
          {itemsArray}
        </div>
      </Card.Body>
    </Card>
  )
}

export default SelectedBox
