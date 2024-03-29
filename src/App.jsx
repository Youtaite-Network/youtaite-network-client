import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import Home from './components/Home';
import Submit from './components/submit/Submit';
import About from './components/About';
import GoogleLoginWrapper from './components/GoogleLoginWrapper';
import AlertContext from './components/AlertContext';

function App() {
  const [alerts, setAlerts] = useState([]);
  const alertContext = useMemo(() => ({
    setAlert(...args) {
      const newAlerts = [...alerts];
      args.forEach(([id, message, variant]) => {
        const index = newAlerts.findIndex((alert) => alert.id === id);
        if (index >= 0) {
          newAlerts.splice(index, 1);
        }
        if (message) {
          newAlerts.push({ id, message, variant });
        }
      });
      setAlerts(newAlerts);
    },
  }), [alerts]);

  return (
    <AlertContext.Provider value={alertContext}>
      <Router>
        <div>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/home">Youtaite Network</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/submit">Submit</Nav.Link>
                <Nav.Link href="/about">What&apos;s this?</Nav.Link>
              </Nav>
              <GoogleLoginWrapper />
            </Navbar.Collapse>
          </Navbar>
          <div className="container">
            {alerts.map((alert) => (
              <Alert key={alert.id} variant={alert.variant}>
                {alert.message}
              </Alert>
            ))}
          </div>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/submit">
              <Submit />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </AlertContext.Provider>
  );
}

export default App;
