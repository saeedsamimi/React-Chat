import useInput from "@hooks/useInput.tsx";
import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";

interface EditInformationDialogProps {
    show: boolean,
    initialValue: string,
    onHide: () => void,
    onAccept: (arg0: string) => void
}

export default function EditInformationDialog({show, onHide, initialValue, onAccept}: EditInformationDialogProps) {
    const [displayName, displayNameHandler, setDisplayName] = useInput(initialValue === undefined ? initialValue : '', true)
    const [error, setError] = useState({
        show: false,
        msg: '',
    })

    const handleCancel = () => {
        setDisplayName && setDisplayName(initialValue);
        setError({show: false, msg: ""})
        onHide();
    }

    const handleSubmit = () => {
        if (displayName !== initialValue) {
            if (displayName.trim().length > 0) {
                onAccept(displayName)
                handleCancel()
            } else
                setError({show: true, msg: "The Display name must be non-empty!"})
        }

    }

    return (
        <Modal
            show={show}
            onHide={handleCancel}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Display name: </Form.Label>
                        <Form.Control type='text' value={displayName}
                                      onChange={displayNameHandler}
                                      isInvalid={error.show}/>
                        <Form.Control.Feedback tooltip type="invalid">
                            {error.msg}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="mx-1" onClick={handleSubmit}>
                    Save changes
                </Button>
                <Button variant="secondary" className="mx-1" onClick={handleCancel}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}