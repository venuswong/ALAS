import React, { Component } from 'react';
import {FormControl, FormGroup, Glyphicon, Navbar} from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import {getUserAccountType, getUserFirstName, isUserLoggedIn} from "../session/Session";
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger";
import Cookies from 'universal-cookie';
import Button from "react-bootstrap/es/Button";
import './Header.css';
import alasLogo from "../image/ALAS.png";

const cookies = new Cookies();

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserLoggedIn: false,
            userFirstName: "",
            accountType: null,
            sidenavToggle: this.props.sidenavToggle,
            language: cookies.get("googtrans") || "/en/en"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit() {
        const {language, isUserLoggedIn} = this.state;
        if (isUserLoggedIn) {
            fetch('/api/user/change-language', {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    language: language
                })
            });
        }
        cookies.set("googtrans", this.state.language, {path: '/'});
        window.location.reload();
    };

    componentDidMount() {
        isUserLoggedIn().then(result => {
            if (result.status === 200) {
                this.setState({
                    isUserLoggedIn: true,
                });
                getUserFirstName().then(result => result.json())
                    .then(json => {
                    console.log(json);
                    this.setState({
                        userFirstName: json.Fname,
                    })
                });
                getUserAccountType().then(accountTypeResult => {
                    if (accountTypeResult.status === 200) {
                        accountTypeResult.json().then(accountTypeJson => {
                            this.setState({
                                accountType: accountTypeJson.Account_Type,
                            });
                        })
                    }
                });
            }
        });
    }

    render() {
        const {isUserLoggedIn, userFirstName} = this.state;
        const logoLink = (
            <a href={"/"}>
                <img src={alasLogo} alt={"ALAS logo"} height={21} width={66}/>
            </a>
        ); // size = 30%
        const popoverLeft = (
            <Popover id="popover-positioned-left" title="Select Language">
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="language" bsSize="large">
                            <FormControl
                                componentClass="select"
                                placeholder={this.state.language}
                                value={this.state.language}
                                onChange={this.handleChange}
                            >
                                <option value="/en/en">English</option>
                                <option value="/en/es">Español</option>
                                <option value="/en/fr">Français</option>
                                <option value="/en/zh-CN">简体中文</option>
                                <option value="/en/ja">日本語</option>
                                <option value="/en/ko">한국어</option>
                                <option value="/en/so">Somali</option>
                                <option value="/en/ne">नेपाली</option>
                                <option value="/en/hi">हिंदी</option>
                            </FormControl>
                            <br></br>
                            <Button type="submit" className={"btn btn-primary"}>Save Changes</Button>
                        </FormGroup>
                    </form>
                </div>
            </Popover>
        );

        if (isUserLoggedIn) {
            return (
                <Navbar className={"header"}>
                    <Glyphicon className={"header-item-hamburger-btn"} glyph={"glyphicon glyphicon-menu-hamburger"} onClick={this.state.sidenavToggle}/>
                    <Navbar.Header>
                        <Navbar.Brand className={"header-brand"}>
                            {logoLink}
                        </Navbar.Brand>
                    </Navbar.Header>
                    <span className={"header-account-text"}>
                        {userFirstName.length > 0 &&
                           <span className={"header-greeting"}>Hello, {userFirstName}</span>
                        }
                        <a href={"/logout"}><u>Logout</u></a>
                    </span>
                    <div className={"header-right"}>
                        <OverlayTrigger trigger="click" placement="left" overlay={popoverLeft}>
                            <Glyphicon glyph={"glyphicon glyphicon-globe"}/>
                        </OverlayTrigger>
                    </div>
                </Navbar>
            );
        } else {
            return (
                <Navbar className={"header"}>
                    <Navbar.Header>
                        <Navbar.Brand className={"header-brand"}>
                            {logoLink}
                        </Navbar.Brand>
                    </Navbar.Header>
                    <div className={"header-right"}>
                        <OverlayTrigger trigger="click" placement="left" overlay={popoverLeft}>
                            <Glyphicon glyph={"glyphicon glyphicon-globe"}/>
                        </OverlayTrigger>
                    </div>
                </Navbar>
            );
        }
    }
}

export default Header;
