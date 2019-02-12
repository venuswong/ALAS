import React, { Component } from 'react';
import {Button, Glyphicon, Panel, Table} from "react-bootstrap";
import Collapse from "@material-ui/core/Collapse/Collapse";
import '../action/ActionComponent.css';
import Well from "../action/ActionComponent";
import CheckmarkIcon from "../image/alas-checkmark.svg";

class ClinicianComponent extends Component {
    constructor(props) {
        super(props);

        const action = props.action;
        this.state = {
            action,
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

    displayCheckmarkIfCompleted(isCompleted) {
        if (isCompleted) {
            return <img className="completed-checkmark" src={CheckmarkIcon}/>
        } else {
            return;
        }
    }

    createActionComponent() {
        const {IsCompleted, IsStarted} = this.state.action;
        const {title} = this.state.actionText;
        const progress_table = this.state.progress_table;
        const actionCardStyle = IsCompleted ? "action-card-completed" : "action-card";
        return (
            <div className={actionCardStyle}>
                <div className="action-card-header">
                    <h2>{title}</h2>
                    {this.displayCheckmarkIfCompleted(IsCompleted)}
                </div>
                <div className="action-card-content">
                    {this.state.progress_table.length ? (
                        <div>
                            <a onClick={() => this.setState({ open_Table: !this.state.open_Table })}>Show table</a>
                            <Collapse in={this.state.open_Table}>
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
                            </Collapse>
                        </div>
                    ) : (
                        <p>No progress has been made yet.</p>
                    )
                    }
                </div>
            </div>
        );
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
