import React, { useState } from 'react'
import { signupStyles } from '../assets/dummystyles'
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';

const isValidEmail = (email)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = ({ onSignupSuccess = null }) => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");  
  
  // email validation function
  const validate = ()=>{
    const e = {};
    if(!name.trim()) e.name = "Name is required";
    if(!email) e.email = "Email is required";
    else if(!isValidEmail(email)) e.email = "Please enter a valid email";
    if(!password) e.password = "Password is required";
    else if(password.length < 6) 
        e.password = "Password must be atleast 6 characters";
    return e;
  };
    
  const API_BASE = 'https://quiz-app-fsci.onrender.com';
   
  const handleSubmit = async (ev) =>{
      ev.preventDefault();
      setSubmitError("");
      const v = validate();
      setError(v);
      if(Object.keys(v).length) return;
      setLoading(true);

      try {
        const payload = {name: name.trim(),email: email.trim().toLowerCase(),password};
        const resp = await fetch(`${API_BASE}/api/auth/signup`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        let data = null;
        try {
            data = await resp.json();
        } catch (error) {
            // ignore
        }
        if(!resp.ok){
            const msg = data?.message || "Resgistration failed";
            setSubmitError(msg);
            return;
        }
        if(data?.token)
        {
            try {
                localStorage.setItem('authToken',data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser',JSON.stringify(data.user || 
                {name: name.trim(),email: email.trim().toLowerCase()}));
            } catch (error) {
                //ignore 
            }
        }

      if(typeof onSignupSuccess === 'function')
      {
        try {
            onSignupSuccess(
                data.user || {
                    name: name.trim(),email: email.trim().toLowerCase()
                }
            );
        } catch (error) { }
      }
    
       navigate('/',{replace: true});
       
     } 
     catch(error) { 
        console.error("Signup error: ",error);
        setSubmitError("Network error");
     }  
     finally{
        setLoading(false);
     } 
  };

  return (
    <div className={signupStyles.pageContainer}>
      <Link to="/login" className={signupStyles.backButton}>
      <ArrowLeft className={signupStyles.backButtonIcon}/>
      <span className={signupStyles.backButtonText}>Back</span>
      </Link>
      <div className={signupStyles.formContainer}>
       <form onSubmit={handleSubmit}>
         <div className={signupStyles.animatedBorder}>
          <div className={signupStyles.formContent}>
          <h2 className={signupStyles.heading}>
            <span className={signupStyles.headingIcon}>
                <CheckCircle className={signupStyles.headingIconInner}/>
            </span>
            <span className={signupStyles.headingText}>Create Account</span>
          </h2> 
          <p className={signupStyles.subtitle}>
            Sign in to continue QuizzApp
          </p>
          <label className={signupStyles.label}>
          <span className={signupStyles.labelText}>Full name</span>
          <div className={signupStyles.inputContainer}>
           <span className={signupStyles.inputIcon}>
            <User className={signupStyles.inputIconInner}/>
           </span>
           <input type="text" name="name" value={name} onChange={(e)=> {setName(e.target.value); 
           if(error.name) setError((s)=>({ ...s,name: undefined}))
        }} 
        className={`${signupStyles.input} ${error.name ? signupStyles.inputError : signupStyles.inputNormal}`}
        placeholder='your name' required/>
          </div>
          { error.name && (
            <p className={signupStyles.errorText}>{error.name}</p>
          )}
          </label>

         <label className={signupStyles.label}>
          <span className={signupStyles.labelText}>Email</span>
          <div className={signupStyles.inputContainer}>
           <span className={signupStyles.inputIcon}>
            <Mail className={signupStyles.inputIconInner}/>
           </span>
           <input type="email" name="email" value={email} onChange={(e)=> {setEmail(e.target.value); 
           if(error.email) setError((s)=>
          ({ ...s,email: undefined,
             
           }))
        }} className={`${signupStyles.input} ${error.email ? signupStyles.inputError : signupStyles.inputNormal}`}
        placeholder='your@example.com' required/>
          </div>
          { error.email && (
            <p className={signupStyles.errorText}>{error.email}</p>
          )}
          </label>

         <label className={signupStyles.label}>
          <span className={signupStyles.labelText}>Password</span>
          <div className={signupStyles.inputContainer}>
           <span className={signupStyles.inputIcon}>
            <Lock className={signupStyles.inputIconInner}/>
           </span>
           <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e)=> {setPassword(e.target.value); 
           if(error.password) setError((s)=>
          ({ ...s,password: undefined,
             
           }))
        }} className={`${signupStyles.input} ${signupStyles.passwordInput} ${error.password ? signupStyles.inputError : signupStyles.inputNormal}`}
        placeholder='Create a password' required/>

        <button type="button" onClick={()=>setShowPassword((s)=> !s)} className={signupStyles.passwordToggle}>
                 {showPassword ? (
                    <EyeOff className={signupStyles.passwordToggleIcon}/>
                 ) : ( <Eye className={signupStyles.passwordToggleIcon}/>
                 )}
                 </button>

          </div>
          { error.password && (
            <p className={signupStyles.errorText}>{error.password}</p>
          )}
          </label>

         { submitError && (
           <p className={signupStyles.submitError} role="alert">
             {submitError}
            </p>
        )} 

        <div className={signupStyles.buttonsContainer}>
            <button type="submit" disabled={loading} className={signupStyles.submitButton}>
                  { loading ? "Creating account" : "Create account"} 
            </button>
        </div>

          </div>
         </div>
       </form>

       <div className={signupStyles.loginPromptContainer}>
         <div className={signupStyles.loginPromptContent}>
            <span className={signupStyles.loginPromptText}>
                Already have an account?
            </span>
            <Link to="/login" className={signupStyles.loginPromptText}>Login
            </Link>
        </div> 
       </div>

      </div>
    </div>
  )
}

export default Signup

