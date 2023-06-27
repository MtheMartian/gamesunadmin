import React, { useRef, useEffect, useState } from "react";
import Loader from '../components/PageLoader';
import { checkAuth, checkIfServerOn } from "../js/admin";

function SignUpForm() {
    const [email, pass, confPass] = [useRef(), useRef(), useRef()];
    const [errorMessage, setErrorMessage] = useState(null);
    

    async function signUp() {
        const response = await fetch("/admins/signup", {
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
                window.location = "/";
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
    //Server Running?
    const [isServerOn, setIsServerOn] = useState(false);

     // Check if server up and running
     useEffect(()=>{
        const serverChecker = setInterval(checkIfServerOn, 3000);
  
        if(checkIfServerOn()){
          clearInterval(serverChecker);
          setIsServerOn(prev => prev = checkIfServerOn());
        }
  
        return()=>{
          clearInterval(serverChecker);
        }
      }, [])

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div>
            {isServerOn ? 
            <div className="auth-page">
                <div className="auth-page-form-wrapper">
                    <div className="auth-page-action">Register</div>
                    <SignUpForm />
                </div>
            </div> : <Loader />
            }
        </div>
    );
}