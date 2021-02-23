import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import getVideoId from 'get-video-id';
import axios from 'axios';
import Cookies from 'js-cookie';
import AlertContext from '../AlertContext';

function CollabLink({
  onSubmit, resetOnChange, setRandom, random,
}) {
  // refs
  const prevResetOnChange = useRef();
  const defaultButton = useRef(null);
  const randomButton = useRef(null);
  const input = useRef(null);

  // state/context
  const initializeCollabLink = () => {
    const storedYtId = window.localStorage.getItem('ytId');
    if (storedYtId) {
      return `https://youtube.com/watch?v=${storedYtId}`;
    }
    return '';
  };
  const [collabLink, setCollabLink] = useState(initializeCollabLink());
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (window.localStorage.getItem('ytId')) {
      defaultButton.current.click();
    }
  }, []);

  useEffect(() => {
    if (prevResetOnChange.current !== resetOnChange) {
      if (random) {
        randomButton.current.click();
      } else {
        setCollabLink('');
        input.current.focus();
      }
    }
    prevResetOnChange.current = resetOnChange;
  }, [resetOnChange, random]);

  const handleCollabLinkChange = (e) => {
    setCollabLink(e.target.value);
  };

  const handleClick = () => {
    if (!collabLink) {
      setAlert(['remove-collab'], ['enter-video', 'Enter a Youtube video link', 'info']);
      input.current.focus();
      return;
    }
    setAlert(['enter-video'], ['remove-collab']);
    setRandom(false);
    // get YT video ID
    let id = collabLink;
    let service = 'youtube';
    const match = id.match(/[\w\d-_]{11}/g);
    if (match && match[0] !== id) {
      ({ id, service } = getVideoId(collabLink));
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)');
      return;
    }
    // call youtaite-network-api.herokuapp.com to get title & description from ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/info/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`,
      },
    })
      .then((collabInfoResponse) => {
        // set cookies
        Cookies.set('access-token', collabInfoResponse.headers['access-token'], {
          expires: new Date(collabInfoResponse.headers['access-token-expiry']),
        });
        const { title, description, channel_id: channelId } = collabInfoResponse.data;
        // get info about channel that posted collab
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channelId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access-token')}`,
          },
        })
          .then((peopleInfoResponse) => {
            // set cookies
            Cookies.set('access-token', peopleInfoResponse.headers['access-token'], {
              expires: new Date(peopleInfoResponse.headers['access-token-expiry']),
            });
            const { name } = peopleInfoResponse.data;
            const byline = `posted by ${name} https://youtube.com/channel/${channelId}`;
            onSubmit(title, byline, description, id);
          }).catch((error) => {
            console.error(error);
          });
      }).catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 403) {
          setAlert(['sign-in', 'Please sign in', 'danger']);
        }
      });
  };

  const getRandom = () => {
    setRandom(true);
    setAlert(['remove-collab']);
    // call youtaite-network-api.herokuapp.com to get title & description from ID
    axios('https://youtaite-network-api.herokuapp.com/collabs/new_random', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`,
      },
    })
      .then((randomCollabResponse) => {
        // set cookies
        Cookies.set('access-token', randomCollabResponse.headers['access-token'], {
          expires: new Date(randomCollabResponse.headers['access-token-expiry']),
        });
        const {
          yt_id: ytId, title, description, channel_id: channelId,
        } = randomCollabResponse.data;
        // get info about channel that posted collab
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channelId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access-token')}`,
          },
        })
          .then((peopleInfoResponse) => {
            // set cookies
            Cookies.set('access-token', peopleInfoResponse.headers['access-token'], {
              expires: new Date(peopleInfoResponse.headers['access-token-expiry']),
            });
            const { name } = peopleInfoResponse.data;
            const byline = `posted by ${name} (https://youtube.com/channel/${channelId})`;
            onSubmit(title, byline, description, ytId);
            setAlert(['enter-video']);
          }).catch((error) => {
            console.error(error);
          });
      }).catch((error) => {
        console.error(error);
        if (error.response) {
          if (error.response.status === 403) {
            setAlert(['sign-in', 'Please sign in', 'danger']);
          }
        }
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      defaultButton.current.click();
    }
  };

  return (
    <Form.Group>
      <div className="m-1">
        <Form.Label>YouTube video link</Form.Label>
        <Form.Control
          type="yt_link"
          placeholder="https://youtube.com/watch?v=XXXXXX"
          value={collabLink}
          onChange={handleCollabLinkChange}
          onKeyDown={handleKeyDown}
          ref={input}
        />
      </div>
      <Button className="m-1" type="button" ref={defaultButton} variant="primary" onClick={handleClick}>
        Analyze link
      </Button>
      <Button className="m-1" type="button" ref={randomButton} variant="info" onClick={getRandom}>
        I&apos;m feeling lucky
      </Button>
    </Form.Group>
  );
}

CollabLink.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  resetOnChange: PropTypes.bool.isRequired,
  setRandom: PropTypes.func.isRequired,
  random: PropTypes.bool.isRequired,
};

export default CollabLink;
