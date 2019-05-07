import React, { Component } from 'react';
import './PageNotFound.css';

class PageNotFound extends Component {
    render() {
        return (
            <div className={"not-found"}>
                The page you are looking for cannot be found! Click <a href={"/"}>here</a> to return to the login page.
            </div>
        );
    }
}

export default PageNotFound;
