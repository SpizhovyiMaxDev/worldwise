import { Outlet } from "react-router-dom";
import styles from './Sidebar.module.css'
import Logo from './Logo';
import AppNav from './AppNav';


function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />

            <Outlet /> 

            <footer className={styles.footer}>
               <p className={styles.copyright}>
                    &copy; Copyrigth {new Date().getFullYear()} by WorldWise Inc.
               </p>
            </footer>
        </div>
    )
}

export default Sidebar
