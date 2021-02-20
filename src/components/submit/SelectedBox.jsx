import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { MdClear } from 'react-icons/md';
import './SelectedBox.css';

class SelectedBox extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // items
    // current
    // removePerson
    // removeRole

    // event handlers
    this.handleRemovePerson = this.handleRemovePerson.bind(this);
    this.handleRemoveRole = this.handleRemoveRole.bind(this);
  }

  componentDidUpdate() {
    const { items, current } = this.props;
    window.localStorage.setItem('selected', JSON.stringify(items));
    window.localStorage.setItem('currentMiscId', current);
  }

  handleRemovePerson(e) {
    const { id } = e.target;
    const index = id.substring(id.lastIndexOf('-') + 1);
    const { removePerson, items } = this.props;
    removePerson(items[index].misc_id);
  }

  handleRemoveRole(e) {
    const idSplit = e.target.id.split('-');
    const personIndex = idSplit[3];
    const role = idSplit[4];
    const { removeRole, items } = this.props;
    removeRole(items[personIndex].misc_id, role);
  }

  renderItems(items, current) {
    const itemsArray = [];
    items.forEach((item, i) => {
      let border = 'null';
      if (item.misc_id === current) {
        border = 'danger';
      }
      itemsArray.push(
        <Card
          className="row flex-row align-items-center flex-nowrap m-1 pr-3"
          bg="light"
          text="dark"
          border={border}
          key={item.misc_id}
        >
          <div>
            <Image className="m-1" width="40px" height="40px" roundedCircle src={item.thumbnail} />
          </div>
          <div className="mx-1 d-flex flex-column text-truncate">
            <strong>
              {item.id_type === 'no_link' ? item.name
                : (
                  <a href={(item.id_type === 'yt' && `https://youtube.com/channel/${item.misc_id}`)
                  || (item.id_type === 'tw' && `https://twitter.com/i/user/${item.misc_id}`)
                  || `https://${item.misc_id}`}
                  >
                    {item.name}
                  </a>
                )}
            </strong>
            <div className="d-flex">
              {this.renderRoles(item.roles, i)}
            </div>
          </div>
          <Button
            id={`rm-person-btn-${i}`}
            type="button"
            variant="outline-danger"
            className="rm-person-btn d-flex align-items-center p-0 h-100"
            onClick={this.handleRemovePerson}
          >
            <MdClear />
          </Button>
        </Card>,
      );
    });
    return itemsArray;
  }

  renderRoles(roles, personIndex) {
    const rolesArray = [];
    if (roles && roles.length > 0) {
      roles.forEach((role, i) => {
        rolesArray.push(
          <div className="role-card d-flex" key={`role-${personIndex}-${role}`}>
            <i>{`${role},`}</i>
            <Button
              id={`rm-role-btn-${personIndex}-${role}`}
              className="rm-role-btn m-0 p-0"
              variant="outline-danger"
              onClick={this.handleRemoveRole}
            >
              <MdClear className="mt-n1" />
            </Button>
          </div>,
        );
      });
    } else {
      rolesArray.push(
        <div className="role-card d-flex" bg="light" key={`role-${personIndex}-none`}>
          <i>no roles.</i>
        </div>,
      );
    }
    return rolesArray;
  }

  render() {
    const { items, current } = this.props;
    const itemsArray = this.renderItems(items, current);

    return (
      <Card bg="light" className={`mb-3 ${itemsArray.length > 0 ? '' : 'd-none'}`}>
        <Card.Header>Selected people:</Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap">
            {itemsArray}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

SelectedBox.propTypes = {
  current: PropTypes.number.isRequired,
  removePerson: PropTypes.func.isRequired,
  removeRole: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    misc_id: PropTypes.string.isRequired,
    id_type: PropTypes.string.isRequired,
  })).isRequired,
};

export default SelectedBox;
