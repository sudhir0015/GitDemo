import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Configuration from '../../Configuration';

function CreateItemForm(props) {
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)  
  const handleSubmit = () => {

    var jsonObj = null;
    if (props.itemName === "sprint") {
      jsonObj = {
        team: Configuration.getTeamName(),
        sprint: name
      };
    }
    else if (props.itemName === "team") {
      jsonObj = {
        team: name
      };
    }
    props.onSubmit(jsonObj)
    setShow(false)
    setName("")
  }
  

  return (
      <>
        <Button variant="primary" onClick={handleShow} block>
          Create new {props.itemName}
        </Button>

        <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new {props.itemName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{props.itemName} name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder={props.itemName + " name"}
              aria-label={props.itemName + " name"}
              aria-describedby="basic-addon1"
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add {props.itemName}
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
}
export default CreateItemForm;