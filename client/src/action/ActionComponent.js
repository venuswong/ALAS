import React, { Component } from 'react';
import {Panel, Button, Glyphicon, FormGroup, FormControl} from "react-bootstrap";
import {getSD_in_ZipCode, updateAction, getSDPhoneNumber, updateActionNote} from "../session/Session";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Well from "react-bootstrap/es/Well";
import {Grid, Row, Col} from "react-bootstrap/es";
import './ActionComponent.css';
import { Popover, Table } from 'react-bootstrap';
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger"
import CheckmarkIcon from '../image/alas-checkmark.svg'
import CheckmarkIconNavy from '../image/alas-checkmark-navy.svg'
import InProgressIcon from '../image/in-progress-circle.svg'
import DownArrow from '../image/down-arrow.svg'
import "react-select";
import 'classnames'

class ActionComponent extends Component {
    constructor(props) {
        super(props);

        const action = props.action;
        console.log(action);
        let noteLength = 500;
        if (action.Note && action.Note.length) {
            noteLength = 500 - action.Note.length
        }

        this.state = {
            action,
            actionText: this.getActionText(action.ActionType),
            open_Description: false,
            open_Script: false,
            noteExpanded: false,
            progress_table: [],
            School_Phone: "",
            remainingCharacters: noteLength,
            saveButtonValue: "Save",
            saveButtonClass: "btn btn-default note-save-button",
            errorText: ""
        };

        this.updateNote = this.updateNote.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.toggleMessage = this.toggleMessage.bind(this);
        this.loadProgress = this.loadProgress.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.toggleNote = this.toggleNote.bind(this);
    }

    componentDidMount() {
        this.GetNumber(this.state.action.SDIid);
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

    displayProgressSymbol(isCompleted, isStarted) {
        if (isCompleted) {
            return <img className="completed-checkmark" src={CheckmarkIcon}/>
        } else {
            return;
        }
    }

    updateNote(event) {
        let newAction = this.state.action;
        newAction.Note = event.target.value;
        this.setState({
            action: newAction,
            saveButtonValue: "Save",
            saveButtonClass: "btn btn-default note-save-button",
            remainingCharacters: 500 - newAction.Note.length
        });
    }

    saveNote(event) {
        event.preventDefault();
        updateActionNote(this.state.action).then(result => {
            if (result.status === 200 || result.status === 304) {
                this.setState({
                    saveButtonValue: "Saved!",
                    saveButtonClass: "btn btn-default note-save-button saved",
                    errorText: ""
                });
            } else {
                this.setState({
                    saveButtonClass: "btn btn-default note-save-button not-saved",
                    errorText: "There was a problem saving your changes."
                });
            }
        });
    }

    toggleNote() {
        this.setState({
            noteExpanded: !this.state.noteExpanded
        })
    }

    displayProgressOptions(isCompleted, isStarted) {
        let checkmarkVisibility = isStarted ? 'checkmark-small' : 'checkmark-hidden';
        let noteVisibility = isStarted ? 'note-container' : 'note-container-hidden';
        let noteExpanded = isStarted && this.state.noteExpanded ? 'clinician-note' : 'note-hidden';
        let arrowState = this.state.noteExpanded? 'arrow arrow-up' : 'arrow arrow-down';
        let expandButtonState = this.state.noteExpanded? 'toggle-note-button expanded' : 'toggle-note-button';

        if (isCompleted) {
            return (
                <div class="progress-buttons">
                    <button onClick={this.toggleCompleted} class="btn btn-default buttonWidth completion-button">Mark as Incomplete</button>
                </div>
            );
        } else {
            return (
                <div class="in-progress-container">
                    <div class="progress-buttons">
                        <button onClick={this.toggleCompleted} class="btn btn-default buttonWidth completion-button">Mark as Complete</button>
                        <div class="checkbox-container">In-progress
                            <div class="checkmark" onClick={this.toggleMessage}>
                                <img alt="checkmark" class={checkmarkVisibility} src={CheckmarkIconNavy} />
                            </div>
                        </div>
                    </div>
                    <div class={noteVisibility}>
                        <button onClick={this.toggleNote} class={expandButtonState}>
                            Take notes for clinician
                            <img src={DownArrow} alt="arrow" class={arrowState}/>
                        </button>
                        <div class={noteExpanded}>
                            <form onSubmit={this.saveNote} id={"action-form-" + this.state.action.Aid} class="note-form">
                                <textarea class="note-text-box" placeholder="Type something..."
                                          onChange={this.updateNote} value={this.state.action.Note} autoFocus/>
                                <div class="form-save">
                                    <p class="database-error-text">{this.state.errorText}</p>
                                    <p class="characters-remaining">{this.state.remainingCharacters}</p>
                                    <input type="submit" class={this.state.saveButtonClass} value={this.state.saveButtonValue}/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
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
        let newAction = Object.assign(this.state.action);
        newAction.IsStarted = !this.state.action.IsStarted;
        this.setState({
            action: newAction,
            noteExpanded: false
        });

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
                this.setState({
                    action: newAction
                });
                // Update in DB
                updateAction({Aid: newAction.Aid, IsCompleted: newAction.IsCompleted,
                    CompletedDate: newAction.CompletedDate, IsStarted: newAction.IsStarted, Note: newAction.Note});
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
                newAction.IsStarted = newAction.IsCompleted;
                if (newAction.IsCompleted) {
                    newAction.CompletedDate = now;
                } else {
                    newAction.CompletedDate = null;
                }
                this.setState({
                    action: newAction
                });
                // Update in DB
                updateAction({Aid: newAction.Aid, IsCompleted: newAction.IsCompleted,
                    CompletedDate: newAction.CompletedDate, IsStarted: newAction.IsStarted});
            }
        });
    }

    componentDidMount() {
        if(this.state.action.ActionType === "IEP_GET"){
        this.GetNumber(this.state.action.SDIid);
         }
    }

    createActionComponent() {
        return this.renderActionCard();
    }

    GetNumber(SDIid) {
            getSDPhoneNumber(SDIid)
                .then(schoolDistrictInfo => schoolDistrictInfo.json())
                .then(schoolDistrictJson => {
                    let School_Phone = Object.assign(this.state.School_Phone);
                    School_Phone = schoolDistrictJson;
                    this.setState({
                        School_Phone
                    });
                });
    }

    renderActionCard() {
        const {IsCompleted, IsStarted} = this.state.action;
        const progress_table = this.state.progress_table;
        const {title, description_title, description, phoneScript} = this.state.actionText;
        var phoneNumber = 'tel:18888888888';
        if(this.state.action.ActionType === "IEP_GET") {
            if (this.state.School_Phone !== "") {
                phoneNumber = "tel:" + this.state.School_Phone[0].Phone
            }
        }
        const classes = require('classnames');
        const actionCardStyle = classes({
            'action-card-completed': IsCompleted,
            'action-card': !IsCompleted && !IsStarted,
            'action-card-in-progress': IsStarted && !IsCompleted
        });

        if (this.props.age < 3 && this.state.action.ActionType === "IEP_GET") {
            return this.renderDisabledSchoolCard();
        } else {
            return(
                <div className={actionCardStyle}>
                    <div className="action-card-header">
                        <h2>{title}</h2>
                        {this.displayProgressSymbol(IsCompleted, IsStarted)}
                    </div>
                    <div className="action-card-content">
                        <div>
                            <h5><a onClick={() => this.setState({open_Description: !this.state.open_Description})}>
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
                            <a onClick={() => this.setState({open_Script: !this.state.open_Script})}>Ready to call but don't
                                know what to say?</a><br/>
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
                        <div className="action-phone-button">
                            <a href={phoneNumber}>
                                <Button className={"buttonWidth"}>
                                    <Glyphicon glyph={"glyphicon glyphicon-earphone phone-glyph"}/>
                                </Button>
                            </a>
                        </div>
                        }
                        {this.displayProgressOptions(IsCompleted, IsStarted)}
                        </span>
                    </div>
                </div>
            );
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
                    <p class="disabled-description">
                        Your child is too young to require requesting special education services from a school. You
                        should, however, complete this step once your child turns 3. If your child turns 3 while you are
                        still using ALAS, this action will become enabled.
                    </p>
                </div>
            </div>
        );
    }

    render() {
        return this.createActionComponent();
    }
}

export default ActionComponent;
