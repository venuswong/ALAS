import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';
import './Footer.css';

class Footer extends Component {
    render() {
        return (
            <Navbar className={"footer"}>
                <div className={"footer-item-container"}>
                    <span className={"footer-item"}>
                        &copy;2018 ALAS Project
                    </span>
                </div>
            </Navbar>
        );
    }
}

export default Footer;
