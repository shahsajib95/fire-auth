import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',

  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const SignedOutuser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          password: '',
          isValid: false,
          error: '',
          existingUser: false,


        }
        setUser(SignedOutuser);
      })
      .catch(err => {


      })
  }

  const is_valid_email = email => /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = event =>{

    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked
    setUser(createdUser);
  }

  const handlerChange = e => {
    const newUserInfo = {
      ...user
    };

    //perform validation
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = (is_valid_email(e.target.value))
    }

    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }


    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {

    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const createdUser = { ...user };
          createdUser.existingUser =
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    else {
      console.log('form is not valid')
    }

    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    event.preventDefault();
      event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
          <button onClick={handleSignIn}>Sign in</button>

      }
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name} </p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }
      <h1>Our Own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm"> Returning User
      </label>
      

      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input  type="text" onBlur={handlerChange} name="email" placeholder="your mail" required />
        <br />
        <input type="password" onBlur={handlerChange} name="password" placeholder="your Password" required />
        <br />
        <input type="submit" value="Sign in" />
      </form>

      <form style={{display:user.existingUser ?'none' : 'block' }} onSubmit={createAccount}>
        <input type="text" onBlur={handlerChange} name="name" placeholder="your name" required />
        <br />
        <input type="text" onBlur={handlerChange} name="email" placeholder="your mail" required />
        <br />
        <input type="password" onBlur={handlerChange} name="password" placeholder="your Password" required />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
    </div>
  );
}

export default App;
