import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";


export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate = useNavigate();
  const {login, isAuthenticated} = useAuth();
  const [email, setEmail] = useState("max.spizhovyi@gmail.com");
  const [password, setPassword] = useState("131313");


   useEffect(function(){
    if(isAuthenticated === true) {
       navigate("/app", {replace: true})
    }
   }, [isAuthenticated, navigate])


  function handleSubmit(e){
       e.preventDefault();

       if(email&&password) login(email, password)
   }

  return (
    <main className={styles.login}>
      <PageNav /> 

      <form className={styles.form} onSubmit = {handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type = "primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
