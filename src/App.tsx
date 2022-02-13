import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Instances from './components/Instances';

import 'bootstrap/dist/css/bootstrap.min.css';
import CreateInstanceForm from './components/CreateInstanceForm';
import useTimeout from './hooks/useTimeout';

declare global {
  interface Array<T> {
      remove(item: T): T[];
  }
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function remove<T>(this: T[], item: T): T[] {
      const index = this.indexOf(item);
      if (index > -1)
          this.splice(index, 1);
      return this;
  }
}

function App() {
  const [show, setShow] = useState(false);
  const [instances, setInstances] = useState<string[]>([]);

  useTimeout(() => {
    fetch(`http://api.localhost/instance`)
        .then(respose => respose.json())
        .then((data: string[]) => setInstances(data.sort((a, b) => a < b ? -1 : 1)));
  }, 10000);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Makepress</Navbar.Brand>
          <Button variant='primary' onClick={() => setShow(!show)}>Create</Button>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Instances domain='localhost' interval={10000} instances={instances} destroy_callback={name => {setInstances(i => i.remove(name))}}/>
      </Container>
    <CreateInstanceForm domain='localhost' show={show} setShow={setShow} addCallback={name => {setInstances(i => {i.push(name); return i;})}}/></>
  );
}

export default App;
