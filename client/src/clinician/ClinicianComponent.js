import React, { Component } from 'react';
import {Button, Glyphicon, Panel, Table} from "react-bootstrap";
import Collapse from "@material-ui/core/Collapse/Collapse";
import '../action/ActionComponent.css';
import Well from "../action/ActionComponent";
import CheckmarkIcon from "../image/alas-checkmark.svg";
import 'classnames';
import "react-select";
import InProgressIcon from "../image/in-progress-circle.svg";

class ClinicianComponent extends Component {
    constructor(props) {
        super(props);

        const action = this.props.action;
        const age = this.props.age;
        this.state = {
            action,
            age,
            actionText: this.getActionText(action.ActionType),
            open_Table: false,
            progress_table: [],
        };

    }

    componentDidMount() {
        const action = this.state.action;

        fetch("/api/patient/progress/" + action.PIid.toString() + "/" + action.Aid.toString(), {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(resJson => {
                let progress_table = [];
                for (const progress in resJson) {
                    progress_table.push(resJson[progress]);
                }
                this.setState({
                    progress_table: progress_table
                });
            });
    }

    getActionText(ActionType) {
        switch (ActionType) {
            case "IEP_GET":
                return require('../action/ActionText').IEP_GET;
            case "ABA_GET":
                return require('../action/ActionText').ABA_GET;
            case "BDD_GET":
                return require('../action/ActionText').BDD_GET;
            case "HMG_GET":
                return require('../action/ActionText').HMG_GET;
            default:
            // Should not get here!
        }
    }

    displayProgressSymbol(isCompleted, isStarted) {
        if (isCompleted) {
            return <img alt="Complete" className="completed-checkmark" src={CheckmarkIcon}/>
        } else if(!isCompleted && isStarted) {
            return <img alt="In Progress" className="in-progress-circle" src={InProgressIcon}/>;
        } else {
            return;
        }
    }

    renderDisabledSchoolCard() {
        return(
            <div className="disabled-action-card">
                <div className="action-card-header">
                    <h2>School – asking for special education services</h2>
                    <p class="not-needed-header">Not Needed</p>
                </div>
                <div className="action-card-content">
                </div>
            </div>
        );
    }

    createActionComponent() {
        const {IsCompleted, IsStarted} = this.state.action;
        const {title} = this.state.actionText;
        const progress_table = this.state.progress_table;
        const classes = require('classnames');
        const actionCardStyle = classes({
            'action-card-completed': IsCompleted,
            'action-card': !IsCompleted && !IsStarted,
            'action-card-in-progress': IsStarted && !IsCompleted
        });
        if (this.state.age < 3 && this.state.action.ActionType === "IEP_GET") {
            return this.renderDisabledSchoolCard();
        } else {
            return (
                <div className={actionCardStyle}>
                    <div class="in-progress-header">
                        <div className="action-card-header">
                            <h2>{title}</h2>
                            {IsStarted && !IsCompleted ?
                                <p className="in-progress-text">In-Progress</p>
                                :
                                null
                            }
                        </div>
                        {this.displayProgressSymbol(IsCompleted, IsStarted)}
                    </div>
                    <div className="action-card-content">
                        {(IsStarted && !IsCompleted) ? (
                            <div>
                                <h1 class="patient-note-header">Patient notes for you:</h1>
                                {this.state.action.Note && this.state.action.Note.length > 0 ?
                                    <textarea class="patient-note" readOnly="true">{this.state.action.Note}</textarea>
                                    :
                                    <p>None</p>
                                }
                            </div>
                        ) : (
                            null
                        )}
                        {!IsStarted && !IsCompleted ?
                            <p>The patient has not started this action.</p>
                        :
                            null
                        }
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.createActionComponent()}
            </div>
        );
    }
}

export default ClinicianComponent;
