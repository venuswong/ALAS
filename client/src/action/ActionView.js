import React, { Component } from 'react';
import "./ActionView.css";
import {getBasicChildInfoByPIid, getUserActions} from "../session/Session";
import ActionComponent from "./ActionComponent";
import {Panel, Tab, Tabs} from "react-bootstrap";
import HundredDayKitYoung from '../materials/100DayKitYoung.pdf'
import DownloadIcon from '../image/ALAS-download-glyph.svg'
import PanelHeading from "react-bootstrap/es/PanelHeading";
import PanelBody from "react-bootstrap/es/PanelBody";

class ActionView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // (key, value) => {child: [actions...]}
            childActions: {},
            // {key, value} => {PIid: {Fname, Lname, Age}}
            childrenInfo: {},
            loading: true
        };
    }

    componentWillMount() {
        getUserActions()
            .then(response => response.json())
            .then(responseJson => {
                let childActions = {}, i = 0;
                console.log(responseJson);
                for (i; i < responseJson.length; i++) {
                    const PIid = responseJson[i].PIid;

                    // get child's name and age, add to {childrenInfo}
                    getBasicChildInfoByPIid(PIid)
                        .then(childInfo => childInfo.json())
                        .then(childInfoJson => {
                            let childrenInfo = Object.assign(this.state.childrenInfo);
                            childrenInfo[PIid] = childInfoJson[0];
                            this.setState({
                                childrenInfo
                            });
                        });

                    // add to childActions object
                    responseJson[i].IsCompleted === 0 ? responseJson[i].IsCompleted = false : responseJson[i].IsCompleted = true;
                    if (childActions.hasOwnProperty(PIid)) {
                        childActions[PIid].push(responseJson[i]);
                    } else {
                        childActions[PIid] = new Array(responseJson[i]);
                    }
                }

                this.setState({
                    childActions,
                    loading: false
                });
            })
    }

    //TODO: HTML templates for other age ranges
    renderAgeSpecificMaterials(age) {
        if (age > 5) {

        } else if (age >= 3 && age <= 5) {

        } else if (age < 3) {
            return (
                // TODO: Extract this into a constant?
                <div id="age-recognition-container">
                    <div class="age-recognition-panel">
                        <div class="age-recognition-content">
                            <p>AutismSpeaks 100-Day Kit For Young Children</p>
                            <a href={HundredDayKitYoung} download>
                                <button type="button" class="btn btn-primary">
                                    <img src={DownloadIcon} class="download-icon"/>
                                    Download
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="age-recognition-panel">
                        <div class="age-recognition-content">
                            <p>OCALI Modules</p>
                            <a href="https://www.ocali.org/">
                                <button type="button" class="btn btn-primary">Visit &#187;</button>
                            </a>
                        </div>
                    </div>
                </div>
            );
        } else {
            return;
        }
    }


    createTabFromActions(actions) {
        const { childrenInfo } = this.state;
        console.log(childrenInfo);
        const PIid = actions[0].PIid;
        let childName = 'Name not found';
        let firstName;
        let age;
        if (typeof childrenInfo[PIid] !== "undefined") {
            age = childrenInfo[PIid].Age;
            firstName = childrenInfo[PIid].Fname;
            childName = firstName + ' ' + childrenInfo[PIid].Lname;
        }
        return (
            <Tab eventKey={PIid} title={childName}>
                <h2 class="age-recognition-header"> Based on {firstName}'s age, here are relevant learning materials for you: </h2>
                { this.renderAgeSpecificMaterials(age) }
                <h2 class="step-header"> Here are four steps to ensure that {firstName} has the best care:</h2>
                {actions.map((action) => {
                    return <ActionComponent action={action}/>;
                })}
            </Tab>
        );
    }

    render() {
        const { childActions, childrenInfo, loading } = this.state;
        const childActionsKeys = Object.keys(childActions);
        const childInfoKeys = Object.keys(childrenInfo);
        if (!loading) {
            if (childInfoKeys.length > 0) {
                const firstKey = childInfoKeys[0];
                if (childActionsKeys.length > 0) {
                    return (
                        <div>
                            <Tabs id={"child-actions-tabs"}>
                                {childActionsKeys.map((PIid) => {
                                    return this.createTabFromActions(childActions[PIid]);
                                })}
                                <Panel bsStyle={"success"} className="spacing">
                                    <Panel.Heading>
                                        <Panel.Title componentClass="h3">Learn About Autism</Panel.Title>
                                    </Panel.Heading>
                                    <Panel.Body>
                                        <div>
                                            You can start learning now. There are multiple websites, toolkits and webinars to teach you about autism.
                                            Two great internet resources are <a href="https://www.autismspeaks.org ">AutismSpeaks</a> and <a href="https://www.ocali.org)">The Ohio Center for Autism and Low Incidence</a>.
                                        </div>
                                    </Panel.Body>
                                </Panel>
                            </Tabs>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            There are no actions to complete.
                        </div>
                    );
                }
            }
        }
        // Nothing to show yet
        return (
            <br/>
        );
    }
}

export default ActionView;
