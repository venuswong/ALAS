import React, { Component } from "react";
import "./Logout.css";
import {logout} from "../session/Session";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Logout extends Component {
    componentDidMount() {
        logout().then(result => {
            if (result.status === 200) {
                cookies.set("googtrans", "/en/en", {path: '/'});

                // this.props.history.push('/');
                window.location.href = '/';
            } else {
                // TODO: Add error alert
            }
        });
    }

    render() {
        const loading = true;
        return (
            <div className="logout">
                {loading &&
                    <div className={"logout-message"}>
                        Logging you out...
                    </div>
                }
            </div>
        );
    }
}

export default Logout;