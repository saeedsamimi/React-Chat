import {useAuth} from "@hooks/useAuth.tsx";
import EditInformationDialog from "@components/EditInformationDialog";
import {useState} from "react";
import axios from "axios";

export default function Dashboard() {
    const {user, setUser, logout} = useAuth();
    const [show, setShow] = useState(false)

    const changeNameHandler = (name: string) => {
        axios.post("/api/rename", {name}, {withCredentials: true})
            .then(res => {
                setUser(res.data)
            }).catch(err => console.log(err))
    }

    return (
        <>
            <div className="row gap-2 mt-5">
                <div className="col-12 col-lg-4 box">
                    <button className="btn btn-danger btn-sm logout-btn" onClick={logout}>Logout</button>
                    <h1 className="text-center">Profile</h1>
                    <hr/>
                    <div className="row">
                        <div className="col">Username:</div>
                        <div className="col">{user?.username}</div>
                    </div>
                    <div className="row">
                        <div className="col">Display Name:</div>
                        <div className="col">
                            {user?.name ? user?.name :
                                <span className="text-info-emphasis">unknown</span>}
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-end">
                        <button className="btn btn-secondary" style={{maxWidth: 'fit-content'}}
                                onClick={() => setShow(true)}>
                            <span className="bi bi-pencil-square"></span>
                        </button>
                    </div>
                </div>
                <div className="col box">
                    hello
                </div>
            </div>
            <EditInformationDialog
                show={show}
                onHide={() => setShow(false)}
                initialValue={user?.name}
                onAccept={changeNameHandler}
            />
        </>
    );
}