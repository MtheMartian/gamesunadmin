import React, { useRef, useEffect, useState } from "react";
import {checkIfServerOn} from '../js/admin.js';
import '../css/auth-pages.css';
import Loader from '../components/PageLoader';

// TO-DO: COMMENT YOUR CODE DAMMIT!!

function SignInForm() {
    const [email, pass] = [useRef(), useRef()];
    const [errorMessage, setErrorMessage] = useState(null);


    async function signIn() {
        const response = await fetch("/admins/signin", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                "Email": email.current.value,
                "Password": pass.current.value,
            })
        });

        const data = await response.text();
        if (data !== "Success") {
            if (data.includes("Password")) {
                pass.current.style.border = "2px solid red";
                setErrorMessage(prev => prev = data);
            }
            else if (data.includes("Email")) {
                email.current.style.border = "2px solid red";
                setErrorMessage(prev => prev = data);
            }
        }
        else if(data === "Success") {
            setErrorMessage(prev => prev = null);
            pass.current.style.border = "2px solid rgb(50,205,50)";
            email.current.style.border = "2px solid rgb(50,205,50)";
            setTimeout(() => {
                window.location = "/";
            }, 1000)
        }
      
    }

    return (
        <section className="auth-page-form">
            {errorMessage != null ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
            <input type="email" placeholder="Email" ref={email} />
            <input type="password" placeholder="Password" ref={pass} />
            <button onClick={signIn}>Sign In</button>
        </section>
    );
}

export default function SignInPage() {
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
        fetch("/admins")
            .then(response => {
                console.log(response);
                if (!response.redirected) {
                    window.location = "/";
                }
            })

            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            {isServerOn ? 
            <div className="auth-page">
                <div className="auth-page-form-wrapper">
                    <div className="auth-page-action">Sign In</div>
                    <SignInForm />
                </div>
            </div> : <Loader />
            }
        </div>
    );
}