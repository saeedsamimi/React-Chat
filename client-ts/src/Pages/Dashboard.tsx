import {useAuth} from "@hooks/useAuth.tsx";
import React, {useRef, useState} from "react";
import axios from "axios";
import useInput from "@hooks/useInput.tsx";
import {Button, Form, Modal} from "react-bootstrap";

interface EditNameProps {
    show: boolean,
    initialValue: string,
    onHide: () => void,
    onAccept: (newName: string) => void
}

function EditNameDialog({show, initialValue, onHide, onAccept}: EditNameProps) {
    const [displayName, displayNameHandler, setDisplayName] = useInput(initialValue ? initialValue : '', true)
    const [error, setError] = useState({
        show: false,
        msg: '',
    })

    const handleCancel = () => {
        setDisplayName && setDisplayName(initialValue ? initialValue : '');
        setError({show: false, msg: ""})
        onHide();
    }

    const handleSubmit = () => {
        if (displayName !== initialValue) {
            if (displayName.trim().length > 0) {
                onAccept(initialValue);
                setError({show: false, msg: ""});
                onHide();
            } else
                setError({show: true, msg: "The Display name must be non-empty!"})
        }

    }

    return (
        <Modal
            show={show}
            onHide={handleCancel}
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="gap-2">
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

interface EditProfileProps {
    show: boolean,
    onHide: () => void,
    onAccept: (imageData: FormData) => void
}

function EditProfileDialog({show, onHide, onAccept}: EditProfileProps) {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            setProfilePicture(URL.createObjectURL(e.currentTarget.files[0]));
        }
    }

    const handleAccept = () => {
        if (profilePicture && formRef.current) {
            onAccept(new FormData(formRef.current));
            onHide();
        }
    }

    const handleCancel = () => {
        setProfilePicture(null)
        onHide()
    }

    return (
        <Modal
            show={show}
            onHide={handleCancel}
            keyboard={false}
        >
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
                <Form className="gap-2" ref={formRef}>
                    <Form.Group>
                        <Form.Label>Profile:</Form.Label>
                        <Form.Control name="profile" type="file" accept="images/*" onChange={handleChange}/>
                        <div style={{width: 'fit-content', margin: '10px auto'}}>
                            {profilePicture ?
                                <img alt="user profile" className="icon" src={profilePicture}/>
                                : "No Picture was selected!"
                            }
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="mx-1" onClick={handleAccept}>
                    Save changes
                </Button>
                <Button variant="secondary" className="mx-1" onClick={handleCancel}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function Dashboard() {
    const {user, setUser, logout} = useAuth();
    const [editNameShow, setEditNameShow] = useState(false)
    const [editProfileShow, setEditProfileShow] = useState(false)

    const changeNameHandler = (name: string) => {
        axios.post("/api/rename", {name}, {withCredentials: true})
            .then(res => {
                setUser(res.data)
            })
            .catch(console.error)
    }

    const changeProfileHandler = (data: FormData) => {
        axios.post("/api/profile", data, {withCredentials: true})
            .then(res => setUser(res.data))
            .catch(console.error)
    }

    return (
        <>
            <div className="row gap-2 mt-5">
                <div className="col-12 col-lg-4 box">
                    <div className="d-flex flex-row justify-content-between">
                        <button className="btn btn-danger btn-sm logout-btn" onClick={logout}>Logout</button>
                        <button className="btn btn-outline-secondary btn-sm logout-btn"
                                onClick={() => setEditProfileShow(true)}>
                            <span className="bi bi-pencil-square"></span>
                            Edit
                        </button>
                    </div>
                    <div className="icon">
                        {user.profile ?
                            <img alt="person icon" src={"api/pictures/" + user.profile}/>
                            : <p className="text-danger text-center">No icon!</p>
                        }
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-4">Username:</div>
                        <div className="col-6">{user?.username}</div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-4">Display Name:</div>
                        <div className="col-6">
                            {user?.name ? user?.name :
                                <span className="text-info-emphasis">unknown</span>}
                        </div>
                        <div className="col-2">
                            <button className="btn btn-outline-secondary rounded-circle"
                                    style={{maxWidth: 'fit-content'}}
                                    onClick={() => setEditNameShow(true)}>
                                <span className="bi bi-pencil-square"></span>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-end">

                    </div>
                </div>
                <div className="col box">
                    hello
                </div>
            </div>
            <EditNameDialog
                show={editNameShow}
                onHide={() => setEditNameShow(false)}
                initialValue={user.name ? user.name : ''}
                onAccept={changeNameHandler}
            />
            <EditProfileDialog show={editProfileShow} onHide={() => setEditProfileShow(false)}
                               onAccept={changeProfileHandler}/>
        </>
    );
}