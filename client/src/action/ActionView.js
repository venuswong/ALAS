import React, { Component } from 'react';
import "./ActionView.css";
import {getUserActions, getUserPatients, getMaterials, getSchoolDistrict} from "../session/Session";
import ActionComponent from "./ActionComponent";
import {Button, Modal, Panel, Tab, Tabs} from "react-bootstrap";
import HundredDayKitYoung from '../materials/100DayKitYoung.pdf'
import HundredDayKitSchoolAged from '../materials/100DayKitSchoolAged.pdf'
import DownloadIcon from '../image/ALAS-download-glyph.svg'
import InfoIcon from '../image/information-icon.svg'
import moment from 'moment'
import PanelHeading from "react-bootstrap/es/PanelHeading";
import PanelBody from "react-bootstrap/es/PanelBody";

class ActionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // (key, value) => {child: [actions...]}
            childActions: {},
            childrenInfo: {},
            loading: true,
            modal: false,
            modalMaterial: null,
            materials: undefined,
            schoolDistricts: {} /* SCHOOL DISTRICTS FOR EACH CHILD WILL BE IN HERE. */
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillMount() {
        // Gets all learning materials from database and updates state of materials object
        getMaterials().then(response => response.json()).then(responseJson => {
            this.setState({
                materials: responseJson
            });
        });
        // Get all children of the current user and update state of children info object
        getUserPatients().then(response => response.json()).then(responseJson => {
            let patientMap = {};
            // Make sure the key in each (key, value) pair is the patient ID
            for (let i = 0; i < responseJson.length; i++) {
                patientMap[responseJson[i].PIid] = responseJson[i];
            }
            this.setState({
                childrenInfo: patientMap
            }, () => { // After the children info has been updated, get the school districts for them
                this.getChildrenSchoolDistricts();
            });
        });
        // Get all the actions for the user's children, update state of actions object
        getUserActions()
            .then(response => response.json())
            .then(responseJson => {
                let childActions = {}, i = 0;
                for (i; i < responseJson.length; i++) {
                    const PIid = responseJson[i].PIid;
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

    getChildrenSchoolDistricts() {
        for (let child in this.state.childrenInfo) {
            // Retrieve school district from the database using child's school district ID
            getSchoolDistrict(this.state.childrenInfo[child].SDIid)
                .then(schoolDistrictInfo => schoolDistrictInfo.json())
                .then(schoolDistrictJson => {
                    let schoolDistricts = Object.assign(this.state.schoolDistricts);
                    schoolDistricts[this.state.childrenInfo[child].PIid] = schoolDistrictJson[0];
                    // update school districts object with new entry
                    this.setState({
                        schoolDistricts
                    });
                    console.log(this.state.schoolDistricts);
                });
        }
    }

    // returns panel HTML based on the age of the child
    renderAgeSpecificMaterials(age) {
        console.log(age);
        let ageSpecificMaterials;
        if(age < 3)
            ageSpecificMaterials = this.state.materials.filter((material) => material.Toddler === 1);
        else if (3 <= age && age < 5) {
            ageSpecificMaterials = this.state.materials.filter((material) => material.Young === 1);
        } else {
            ageSpecificMaterials = this.state.materials.filter((material) => material.Child === 1);
            console.log(ageSpecificMaterials);
        }
        return (
            <div>
                {this.renderInfoModal()}
                {ageSpecificMaterials.map((material) => {
                    return this.buildAgeRecognitionPanel(material);
                })}
            </div>
        );
    }

    closeModal() {
        this.setState({modal: false});
    }

    openModal(e, material) {
        e.preventDefault();
        this.setState({
            modal: true,
            modalMaterial: material
        });
    }

    renderInfoModal() {
        return (
            <div>
                {this.state.modal ?
                    <Modal show={this.state.modal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Information about this material</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.modalMaterial.Description}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    : null }
            </div>
        );
    }

    // Takes a material JSON object that was fetched from the Materials table and builds the corresponding panel
    buildAgeRecognitionPanel(material) {
        if(material.IsLink === 1) {
            return(
                <div class="age-recognition-panel">
                    <div class="age-recognition-content">
                        <p>{material.Title}</p>
                        <img src={InfoIcon} class="info-icon" onClick={(e) => this.openModal(e, material)}/>
                        <a href={material.Link}>
                            <button type="button" class="btn btn-primary">Visit &#187;</button>
                        </a>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="age-recognition-panel">
                    <div className="age-recognition-content">
                        <p>{material.Title}</p>
                        <img src={InfoIcon} className="info-icon" onClick={(e) => this.openModal(e, material)}/>
                        <a href={this.getStaticAsset(material)} download>
                            <button type="button" className="btn btn-primary">Download
                                <img src={DownloadIcon} className="download-icon"/>
                            </button>
                        </a>
                    </div>
                </div>
            );
        }
    }

    getStaticAsset(material) {
        if(material.Title.match(/AutismSpeaks/) && material.Title.match(/Young/)) {
            return HundredDayKitYoung;
        } else {
            return HundredDayKitSchoolAged;
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
                                return <ActionComponent action={action} age={age}/>;
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
