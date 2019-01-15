import React from "react";
import "./Sidenav.css";
import {getUserAccountType} from "../session/Session";

class Sidenav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: props.style,
            toggle: props.toggle,
            accountType: null
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            style: props.style,
        });
    }

    componentDidMount() {
        getUserAccountType().then(accountTypeResult => {
            if (accountTypeResult.status === 200) {
                accountTypeResult.json().then(accountTypeJson => {
                    console.log("Setting accountType to " + accountTypeJson.Account_Type);
                    this.setState({
                        accountType: accountTypeJson.Account_Type,
                    });
                })
            }
        });
    }

    getSideNavOptions() {
        switch (this.state.accountType) {
            case "Admin":
                return (
                    <div>
                        <a href="/">Home</a>
                    </div>
                );
            case "Clinician":
                return (
                    <div>
                        <a href="/">Patient Progress</a>
                        <a href="/answer">Answer Questions</a>
                        <a href="/faq">View FAQs</a>
                        <a href="/about">About</a>
                    </div>
                );
            case "Patient":
                return (
                    <div>
                        <a href="/">Things To Do</a>
                        <a href="/profile">My Profile</a>
                        <a href="/faq">FAQ</a>
                        <a href="/about">About</a>
                    </div>
                );
            default:
                // this should not happen
                return null;
        }
    }


    render() {
        const {style, toggle} = this.state;

        const sideNavOptions = this.getSideNavOptions();

        return(
            <div className="sidenav" style={style}>
                <div className={"sidenav-container"}>
                    <a className={"sidenav-btn-close"} style={{cursor: 'pointer'}} onClick={toggle}>&times;</a>
                </div>
                <div className={"sidenav-container"}>
                    {sideNavOptions}
                </div>
            </div>
        );
    }
}

export default Sidenav;