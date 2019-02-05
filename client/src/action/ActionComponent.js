import React, { Component } from 'react';
import {Panel, Button, Glyphicon, FormGroup, FormControl} from "react-bootstrap";
import {updateAction} from "../session/Session";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Well from "react-bootstrap/es/Well";
import {Grid, Row, Col} from "react-bootstrap/es";
import './ActionComponent.css';
import { Popover, Table } from 'react-bootstrap';
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger"
import CheckmarkIcon from '../image/alas-checkmark.svg'

class ActionComponent extends Component {
    constructor(props) {
        super(props);

        const action = props.action;
        this.state = {
            action,
            actionText: this.getActionText(action.ActionType),
            open_Description: false,
            open_Script: false,
            progress_table: [],
        };

        this.toggleMessage = this.toggleMessage.bind(this);
        this.loadProgress = this.loadProgress.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
    }

    getActionText(ActionType) {
        switch (ActionType) {
            case "IEP_GET":
                return require('./ActionText').IEP_GET;
            case "ABA_GET":
                return require('./ActionText').ABA_GET;
            case "BDD_GET":
                return require('./ActionText').BDD_GET;
            case "HMG_GET":
                return require('./ActionText').HMG_GET;
            default:
                // Should not get here!
        }
    }

    displayCheckmarkIfCompleted(isCompleted) {
        if (isCompleted) {
            return <img className="completed-checkmark" src={CheckmarkIcon}/>
        } else {
            return;
        }
    }

    displayCompletionButton(isComplete) {
        if(isComplete) {
            return <button onClick={this.toggleCompleted} class="btn btn-default incomplete-button">Mark as Incomplete <span class="incomplete">x</span></button>
        } else {
            return <button onClick={this.toggleCompleted} class="btn btn-default complete-button">Mark as Complete</button>
        }
    }

    loadProgress() {
        const action = this.state.action;

        fetch("/api/patient/progress/" + action.PIid.toString() + "/" + action.Aid.toString(), {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }) .then(res => res.json())
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

    toggleMessage() {
        const action = this.state.action;
        const now = new Date();

        fetch("/api/patient/update_progress", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PIid: action.PIid,
                Aid: action.Aid,
                timestamp: now,
                progress: "Left Message",
            })
        }).then(result => {
            if (result.status === 200) {
                let newAction = Object.assign(this.state.action);
                newAction.IsStarted = true;
                this.setState({
                    action: newAction
                });
                // Update in DB
                updateAction({Aid: newAction.Aid, IsCompleted: newAction.IsCompleted, CompletedDate: newAction.CompletedDate, IsStarted: newAction.IsStarted});
                window.location.reload();
            }
        });
    }

    toggleCompleted() {
        // Update ClinicianView when toggled
        if (this.props.onToggle) {
            this.props.onToggle();
        }
        const now = new Date();

        let progress='';
        if(!this.state.action.IsCompleted===true){
            progress = 'Completed'
        } else {
            progress = 'Uncompleted'
        }

        fetch("/api/patient/update_progress", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PIid: this.state.action.PIid,
                Aid: this.state.action.Aid,
                timestamp: now,
                progress: progress,
            })
        }).then(result => {
            if (result.status === 200) {
                let newAction = Object.assign(this.state.action);
                newAction.IsCompleted = !this.state.action.IsCompleted;
                if (newAction.IsCompleted) {
                    newAction.CompletedDate = now;
                } else {
                    newAction.CompletedDate = null;
                }
                this.setState({
                    action: newAction
                });
                // Update in DB
                updateAction({Aid: newAction.Aid, IsCompleted: newAction.IsCompleted, CompletedDate: newAction.CompletedDate, IsStarted: newAction.IsStarted});
                window.location.reload();
            }
        });
    }


    createActionComponent() {
        const {IsCompleted, IsStarted} = this.state.action;
        const progress_table = this.state.progress_table;
        const {title, description_title, description, phoneScript} = this.state.actionText;
        const phoneNumber = 'tel:18008888888'; // TODO: Get this from DB

        const actionCardStyle = IsCompleted ? "action-card-completed" : "action-card";

        const popoverTop = (
            <Popover id="popover-positioned-top">
                <div>
                    <span>
                        <Button onClick={this.toggleMessage}>Left Message</Button>
                        {IsCompleted &&
                        <Button bsStyle={"success"} onClick={this.toggleCompleted}>
                            Completed
                        </Button>
                        }
                        {!IsCompleted &&
                        <Button bsStyle={"primary"} onClick={this.toggleCompleted}>
                            Mark Completed
                        </Button>
                        }
                    </span>
                </div>
            </Popover>
        );

        const popoverProgress = (
            <Popover id="popover-positioned-left">
                <div>
                    {this.state.progress_table.length ? (
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Action</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                progress_table.map(
                                    (progress_row) => {
                                        return (
                                            <tr>
                                                <td>{progress_row.progress}</td>
                                                <td>{progress_row.time.substring(0, 10)}</td>
                                            </tr>
                                        );
                                    }
                                )
                            }
                            </tbody>
                        </Table>
                    ) : (
                        <p>No progress has been made yet.</p>
                    )
                    }
                </div>
            </Popover>
        );

        return (
            <div class={actionCardStyle}>
                <div class="action-card-header">
                    <h2>{title}</h2>
                    { this.displayCheckmarkIfCompleted(IsCompleted)}
                </div>
                <div class="action-card-content">
                    <div>
                        <h5><a onClick={() => this.setState({ open_Description: !this.state.open_Description })}>
                            {description_title}
                        </a></h5>
                        <Collapse in={this.state.open_Description}>
                            <div>
                                <Well>
                                    {description}
                                </Well>
                           </div>
                        </Collapse>
                    </div>
                    {phoneScript && !IsCompleted &&
                        <div>
                            <a onClick={() => this.setState({ open_Script: !this.state.open_Script })}>Ready to call but don't know what to say?</a><br/>
                            <Collapse in={this.state.open_Script}>
                                <div>
                                   <Well>
                                        {phoneScript}
                                    </Well>
                                </div>
                           </Collapse>
                        </div>
                    }
                    <br/>
                    <span>
                    {!IsCompleted &&
                        <div class="action-phone-button">
                            <a href={phoneNumber}>
                                <Button className={"buttonWidth"}>
                                    <Glyphicon glyph={"glyphicon glyphicon-earphone"}/>
                                </Button>
                            </a>
                        </div>
                    }
                        <div class="toggle-completion">
                            { this.displayCompletionButton(IsCompleted)}
                        </div>
                    </span>
                </div>
            </div>
        );
    }

    render() {
        return this.createActionComponent();
    }
}

export default ActionComponent;
