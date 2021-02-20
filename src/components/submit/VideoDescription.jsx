import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Image from 'react-bootstrap/Image';
import Linkify from 'linkifyjs/react';
import { MdCheck, MdAdd } from 'react-icons/md';
import axios from 'axios';
import Cookies from 'js-cookie';

function stripProtocol(link) {
  if (link.startsWith('http')) {
    const url = new URL(link);
    return `${url.hostname}${url.pathname}`;
  }
  return link;
}

function VideoDescription({
  description, byline, addPersonToSelected, selected,
}) {
  const itemsArray = [<strong key="byline">{byline}</strong>, <br key="br-byline" />];
  description.split('\n').forEach((line, i) => {
    itemsArray.push(<span key={`span-${i.toString()}`}>{line}</span>);
    itemsArray.push(<br key={`br-${i.toString()}`} />);
  });

  function formatter(value) {
    return (
      <VideoDescriptionLink
        link={value}
        addPersonToSelected={addPersonToSelected}
        selected={selected}
      />
    );
  }

  return (
    <Linkify className="d-inline" options={{ tagName: 'span', format: formatter }}>
      {itemsArray}
    </Linkify>
  );
}

function VideoDescriptionLink({ link, addPersonToSelected, selected }) {
  const [channelInfo, setChannelInfo] = useState({});
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const linkWithoutProtocol = stripProtocol(link);
    axios(`https://youtaite-network-api.herokuapp.com/people/info_from_url/${linkWithoutProtocol}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`,
      },
    })
      .then((response) => {
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['access-token-expiry']),
        });
        setChannelInfo({
          thumbnail: response.data.thumbnail,
          name: response.data.name,
          misc_id: response.data.misc_id,
          id_type: response.data.id_type,
        });
      })
      .catch((error) => {
        // fail silently for 404
        if (error.response && !error.response.status === 404) {
          console.error(error);
        }
      });
  }, [link]);

  useEffect(() => {
    if (selected.find((person) => person.misc_id === channelInfo.misc_id)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [channelInfo, selected]);

  const handleClick = () => {
    addPersonToSelected(channelInfo);
  };

  const popover = (
    <Popover id={`popover-${link}`} style={{ maxWidth: '250px' }}>
      <Popover.Title className="text-truncate" as="h3">
        <Image className="mr-2" width="40px" height="40px" roundedCircle src={channelInfo.thumbnail} />
        <strong>{channelInfo.name}</strong>
      </Popover.Title>
      <Popover.Content>
        <em>
          Click to
          {added ? ' select' : ' add'}
          .
          {channelInfo.id_type !== 'yt' ? ' Please check if they have a YT link before adding!' : ''}
        </em>
        {channelInfo.description}
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <a href={link}>{link}</a>
      {channelInfo.name
        && (
        <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
          <Button className="mx-2 mt-n1 p-0" variant={added ? 'success' : 'outline-info'} style={{ lineHeight: '.5' }} onClick={handleClick}>
            {added ? <MdCheck /> : <MdAdd />}
          </Button>
        </OverlayTrigger>
        )}
    </>
  );
}

VideoDescription.propTypes = {
  description: PropTypes.string.isRequired,
  byline: PropTypes.string.isRequired,
  addPersonToSelected: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    id_type: PropTypes.string.isRequired,
    misc_id: PropTypes.string.isRequired,
  })).isRequired,
};

VideoDescriptionLink.propTypes = {
  link: PropTypes.string.isRequired,
  addPersonToSelected: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    id_type: PropTypes.string.isRequired,
    misc_id: PropTypes.string.isRequired,
  })).isRequired,
};

export default VideoDescription;
