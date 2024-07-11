import {Link, Navigate} from "react-router-dom";
import React, {useRef} from "react";

import useInput from "@hooks/useInput.tsx";
import {useAuth} from "@hooks/useAuth.tsx";

interface SignInLoginProps {
    mode: 'login' | 'signup';
}

const headers = {
    "signup": {
        name: 'Sign up',
        reverse: 'login',
        label: 'Already registered'
    },
    "login": {
        name: 'Login',
        reverse: 'signup',
        label: 'Dont have an account',
    }
}

export default function SignInLogIn({mode}: SignInLoginProps) {
    const {isLoggedIn, login} = useAuth();
    const [username, usernameChanged] = useInput("")
    const [password, passwordChanged] = useInput("")
    const formRef = useRef<HTMLFormElement>(null)

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formRef.current)
            login(new FormData(formRef.current), mode);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const reverseText: string = headers[headers[mode].reverse].name;

    if (isLoggedIn)
        return <Navigate to="/products" replace/>

    return (
        <div>
            <form className="d-flex flex-column mt-5 mx-auto box gap-2"
                  id="login-form" noValidate onSubmit={submitHandler} ref={formRef} target={mode}>
                <h1 className="align-self-center my-2">{headers[mode].name}</h1>
                <label htmlFor="usernameInput">Username:</label>
                <input className="form-control" type="text" placeholder="Username" name="username"
                       id="usernameInput" value={username} onChange={usernameChanged}/>
                <label htmlFor="passwordInput">Password:</label>
                <input className="form-control" type="password" placeholder="Password" name="password"
                       id="passwordInput" value={password} onChange={passwordChanged}/>
                <button className="btn btn-outline-primary" type="submit">{headers[mode].name}</button>
                <p className="m-auto">{headers[mode].label}? <Link to={`/${headers[mode].reverse}`}
                                                                   replace>{reverseText}</Link>
                </p>
            </form>
        </div>
    );
}