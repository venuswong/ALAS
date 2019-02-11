import React, { Component } from 'react';
import "./ActionView.css";
import {getBasicChildInfoByPIid, getUserActions, getMaterials} from "../session/Session";
import ActionComponent from "./ActionComponent";
import {Panel, Tab, Tabs} from "react-bootstrap";
import HundredDayKitYoung from '../materials/100DayKitYoung.pdf'
import DownloadIcon from '../image/ALAS-download-glyph.svg'
import moment from 'moment'
import PanelHeading from "react-bootstrap/es/PanelHeading";
import PanelBody from "react-bootstrap/es/PanelBody";

class ActionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // (key, value) => {child: [actions...]}
            childActions: {},
            // {key, value} => {PIid: {Fname, Lname, DoB}}
            childrenInfo: {},
            loading: true,
            materials: undefined
        };
    }

    componentWillMount() {
        this.fetchLearningMaterials();
        this.fetchUserActions();
    }

    // Gets all learning materials rows from the database
    fetchLearningMaterials() {
        getMaterials().then(response => response.json()).then(responseJson => {
            this.setState({
                materials: responseJson
            });
            console.log(this.state.materials);
        });
    }

    fetchUserActions() {
        getUserActions()
            .then(response => response.json())
            .then(responseJson => {
                let childActions = {}, i = 0;
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

    // returns panel HTML based on the age of the child
    renderAgeSpecificMaterials(age) {
        let ageSpecificMaterials;
        if(age < 3)
            ageSpecificMaterials = this.state.materials.filter((material) => material.Toddler === 1);
        else if (3 <= age && age <= 5) {
            ageSpecificMaterials = this.state.materials.filter((material) => material.Young === 1);
        } else {
            ageSpecificMaterials = this.state.materials.filter((material) => material.Child === 1);
        }
        return ageSpecificMaterials.map((material) => {
            return this.buildAgeRecognitionPanel(material);
        });
    }

    // Takes a material JSON object that was fetched from the Materials table and builds the corresponding panel
    buildAgeRecognitionPanel(material) {
        if(material.IsLink === 1) {
            return(
                <div class="age-recognition-panel">
                    <div class="age-recognition-content">
                        <p>{material.Title}</p>
                        <a href={material.Link}>
                            <button type="button" class="btn btn-primary">Visit &#187;</button>
                        </a>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="age-recognition-panel">
                    <div className="age-recognition-content">
                        <p>{material.Title}</p>
                        <a href={material.Link} download>
                            <button type="button" className="btn btn-primary">Download
                                <img src={DownloadIcon} className="download-icon"/>
                            </button>
                        </a>
                    </div>
                </div>
            )
        }
    }

    createTabFromActions(actions) {
        //console.log("called");
        const { childrenInfo } = this.state;
        const PIid = actions[0].PIid;
        let childName = 'Name not found';
        let firstName;
        let age;
        if (typeof childrenInfo[PIid] !== "undefined") {
            age = moment().diff(moment(childrenInfo[PIid].DoB), 'year');
            firstName = childrenInfo[PIid].Fname;
            childName = firstName + ' ' + childrenInfo[PIid].Lname;
        }
        return (
            <Tab eventKey={PIid} title={childName}>
                <h2 class="age-recognition-header"> Based on {firstName}'s age, here is a guide to ensure the best care.</h2>
                <hr/>
                <div id="child-hub">
                    <div className="child-hub-section">
                        <h2 className="actions-header">Important <span className="keyword">actions</span> to take:</h2>
                        <div className="action-cards">
                            {actions.map((action) => {
                                return <ActionComponent action={action}/>;
                            })}
                        </div>
                    </div>
                    <div class="child-hub-section">
                        <h2 className="materials-header">Relevant <span class="keyword">materials</span> to consult:</h2>
                        {this.state.materials &&
                            <div id="age-recognition-container">
                                {this.renderAgeSpecificMaterials(age)}
                            </div>
                        }
                        {!this.state.materials &&
                            <div id="age-recognition-container">
                                Could not display learning materials at this time.
                            </div>
                        }
                    </div>
                </div>
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
