import React, { useRef, useEffect, useState } from "react";
import { checkAuth} from "../js/admin";
import {useNavigate} from "react-router-dom";

function SignUpForm() {
    const [email, pass, confPass] = [useRef(), useRef(), useRef()];
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    
    async function signUp() {
        const response = await fetch(`/admins/signup`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                "Email": email.current.value,
                "Password": pass.current.value,
                "PasswordConfirm": confPass.current.value,
            })
        });

        const data = await response.text();
        if (data === "Success") {
            setErrorMessage(prev => prev = null);
            pass.current.style.border = "2px solid rgb(50,205,50)";
            confPass.current.style.border = "2px solid rgb(50,205,50)";
            email.current.style.border = "2px solid rgb(50,205,50)";
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        else {
            if (data === "Passwords do not match.") {
                pass.current.style.border = "2px solid red";
                confPass.current.style.border = "2px solid red";
                setErrorMessage(prev => prev = data);
            }
            else if (data === "Password should atleast be 8 characters.") {
                pass.current.style.border = "2px solid red";
                setErrorMessage(prev => prev = data);
            }
            else if (data.includes("Email")) {
                email.current.style.border = "2px solid red";
                setErrorMessage(prev => prev = data);
            }
        }
    }

    return (
        <section className="auth-page-form">
            {errorMessage != null ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
            <input type="email" placeholder="Email" ref={email} />
            <input type="password" placeholder="Password" ref={pass} />
            <input type="password" placeholder="Confirm Password" ref={confPass} />
            <button onClick={signUp}>Register!</button>
        </section>
        );
}

export default function SignUpPage() {
    //Redirect
    const navigate = useNavigate();

    useEffect(() => {
        async function runThis(){
            const response = await checkAuth();
            if(typeof response === "string"){
                navigate(response);
            }  
        }
        runThis();
    }, []);

    return (
        <div className="auth-page">
            <div className="auth-page-form-wrapper">
                <div className="auth-page-action">Register</div>
                <SignUpForm />
            </div>
        </div>
    );
}