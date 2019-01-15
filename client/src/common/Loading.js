import {Component} from "react";
import React from "react";
import "./Loading.css";

class Loading extends Component {
    render() {
        return (
            <div className={"loading"}>
                <strong>
                    Loading...
                </strong>
            </div>
        );
    }
}

export default Loading;