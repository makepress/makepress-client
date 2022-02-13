import { useEffect, useRef, useState } from "react"
import { Button, Form, Modal} from "react-bootstrap";

interface Props {
    domain: string;
    show: boolean;
    setShow: (show: boolean) => void;
    addCallback: (name: string) => void;
}

export default function CreateInstanceForm(props: Props) {

    const [name, setName] = useState("");
    const nameInput = useRef<any>();

    const handleCancel = () => props.setShow(false);
    const handleDone = (name: string) => {
        props.addCallback(name);
        fetch(`http://api.${props.domain}/instance/${name}/create`, {
            method: 'POST'
        }).finally(() => props.setShow(false));
    }

    return <Modal show={props.show} onHide={handleCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Create new Instance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => {e.preventDefault(); handleDone(name)}}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameInput} type="text" placeholder="Enter Name" onChange={event => {
                        event.preventDefault();
                        setName(nameInput.current.value);
                    }}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDone(name)}>
            Done
          </Button>
        </Modal.Footer>
    </Modal>
}