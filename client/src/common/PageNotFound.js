import React, { Component } from 'react';
import './PageNotFound.css';

class PageNotFound extends Component {
    render() {
        return (
            <div className={"not-found"}>
                The page you are looking for cannot be found! click <a href={"/"}>here</a> to go home.
            </div>
        );
    }
}

export default PageNotFound;
