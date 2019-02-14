import React, { Component } from 'react';
import Tab from "react-bootstrap/es/Tab";
import Tabs from "react-bootstrap/es/Tabs";
import Row from "react-bootstrap/es/Row";
import Col from "react-bootstrap/es/Col";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import Button from "react-bootstrap/es/Button";
import {Alert, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import "./ProfileView.css"
import {
    isUserLoggedIn,
    getProfile,
    getUserFirstName,
    getChildrenInfo,
    getChildrenInsurance,
    getChildrenSchool,
    postQuestionReponse, postChildInsurance, postChildSchool
} from "../session/Session";
import Cookies from 'universal-cookie';
import {sleep} from "../helpers";

const cookies = new Cookies();
const SLEEP_TIME = 2000;

class ProfileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Uid: '',
            Account_Type: '',
            Fname: '',
            Lname: '',
            Email: '',
            Password: '',
            Picture: '',
            Language: '',
            Children_Information: [],
            Children_Insurance: [],
            Children_School: [],
            alertProps: {
                show: false,
                message: '',
                bsStyle: '',
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInsuranceSubmit = this.handleInsuranceSubmit.bind(this);
        this.handleSchoolSubmit = this.handleSchoolSubmit.bind(this)
    }

    displayAlert() {
        const { alertProps } = this.state;
        if (alertProps.show) {
            return (
                <Alert bsStyle={alertProps.bsStyle}>
                    {alertProps.message}
                </Alert>
            );
        } else {
            return null;
        }
    }

    handleChange(event, dataType, childDataIndex) {
        if(dataType === 'insurance') {
            let newArray = Object.assign(this.state.Children_Insurance);
            newArray[childDataIndex].Name = event.target.value;
            this.setState({
                Children_Insurance: newArray
            });
        } else {
            let newArray = Object.assign(this.state.Children_School);
            newArray[childDataIndex].Name = event.target.value;
            console.log(newArray);
            this.setState({
                Children_School: newArray
            });
        }
    };

    handleInsuranceSubmit(e, childInsuranceIndex) {
        console.log('got here');
        const { Children_Information, Children_Insurance} = this.state;
        e.preventDefault();
        postChildInsurance(Children_Information[childInsuranceIndex], Children_Insurance[childInsuranceIndex]).then((res) => {
            if (res.status === 200) {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Successfully changed insurance',
                        bsStyle: 'success'
                    }
                });
                sleep(SLEEP_TIME).then(() => {
                    this.setState({
                        alertProps: {
                            show: false,
                            message: '',
                            bsStyle: '',
                        }
                    });
                });
            } else {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Unable to change insurance',
                        bsStyle: 'warning'
                    }
                });
                sleep(SLEEP_TIME).then(() => {
                    this.setState({
                        alertProps: {
                            show: false,
                            message: '',
                            bsStyle: '',
                        }
                    });
                });
            }
        })
    };

    handleSchoolSubmit(e, childSchoolIndex) {
        const { Children_Information, Children_School} = this.state;
        e.preventDefault();
        console.log(Children_Information);
        console.log(childSchoolIndex);
        postChildSchool(Children_Information[childSchoolIndex], Children_School[childSchoolIndex]).then((res) => {
            if (res.status === 200) {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Successfully changed school',
                        bsStyle: 'success'
                    }
                });
                sleep(SLEEP_TIME).then(() => {
                    this.setState({
                        alertProps: {
                            show: false,
                            message: '',
                            bsStyle: '',
                        }
                    });
                });
            } else {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Unable to change school',
                        bsStyle: 'warning'
                    }
                });
                sleep(SLEEP_TIME).then(() => {
                    this.setState({
                        alertProps: {
                            show: false,
                            message: '',
                            bsStyle: '',
                        }
                    });
                });
            }
        })
    };

    componentDidMount() {
        isUserLoggedIn().then(result => {
            if (result.status === 200) {
                this.setState({
                    isUserLoggedIn: true,
                });
            }
            getProfile().then(result => result.json())
                .then(json => {
                    this.setState({
                        Account_Type: json.Account_Type,
                        Fname: json.Fname,
                        Lname: json.Lname,
                        Email: json.Email,
                        Password: json.Password,
                        Picture: json.Picture,
                        Language: json.Language
                    })
                });
            getChildrenInfo().then(result => result.json())
                .then(json => {
                    this.setState({
                        Children_Information: json.result
                    })
                });
            getChildrenInsurance().then(result => result.json())
                .then(json => {
                    this.setState({
                        Children_Insurance: json.result
                    })
                });
            getChildrenSchool().then(result => result.json())
                .then(json => {
                    this.setState({
                        Children_School: json.result
                    })
                });
        });
    }

    render(){
        const {Children_Information, Children_Insurance, Children_School} = this.state;
        let childInsuranceIndex = 0;
        let childSchoolIndex = 0;
        return(
            <div className={"defaultview"}>
                {this.displayAlert()}
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={4}>
                            <Nav bsStyle="pills" stacked>
                                <NavItem eventKey="first">Account Information</NavItem>
                                <NavItem eventKey="second">Child Information</NavItem>
                                <NavItem eventKey="third">School Information</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="first">
                                    <form>
                                        <div>
                                            <FormGroup controlId="user_name" bsSize="large">
                                                <ControlLabel>Name</ControlLabel>
                                                <FormControl
                                                    value={this.state.Fname + " " + this.state.Lname}
                                                    disabled ="true"
                                                />
                                            </FormGroup>
                                        </div>
                                        <div>
                                            <FormGroup controlId="email" bsSize="large">
                                                <ControlLabel>Email</ControlLabel>
                                                <FormControl
                                                    value={this.state.Email}
                                                    disabled="true"
                                                />
                                            </FormGroup>
                                        </div>
                                        <div>
                                            <FormGroup>
                                                <a>Reset Password?</a>
                                            </FormGroup>
                                        </div>
                                    </form>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Tabs id="child-info-tabs">
                                        {
                                            Children_Information.map(
                                                (child) => {
                                                    if (Children_Insurance[childInsuranceIndex]) {
                                                        return this.createChildInfoTab(child, childInsuranceIndex++, Children_Insurance);
                                                    }
                                                })
                                        }
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Tabs id="child-school-tabs">
                                        {
                                            Children_Information.map(
                                                (child) => {
                                                    if (Children_School[childSchoolIndex]) {
                                                        return this.createChildSchoolTab(child, childSchoolIndex++, Children_School);
                                                    }
                                                })
                                        }
                                    </Tabs>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }

    createChildInfoTab(child, childInsuranceIndex, childinsurance) {
        return (
            <Tab eventKey={childInsuranceIndex+"insurance"} title={child.Fname + ' ' + child.Lname}>
                <form onSubmit={(e) => this.handleInsuranceSubmit(e, childInsuranceIndex)}>
                    <div>
                        <FormGroup controlId="child_dob" bsSize="medium">
                            <ControlLabel>Date of Birth</ControlLabel>
                            <FormControl
                                value={(new Date(child.DoB)).toLocaleDateString()}
                                disabled ="true"
                            />
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId="child_address" bsSize="medium">
                            <ControlLabel>Address</ControlLabel>
                            <FormControl
                                value={child.Address}
                                disabled ="true"
                            />
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId={childInsuranceIndex} bsSize="medium">
                            <ControlLabel>Insurance</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder={childinsurance[childInsuranceIndex].Name}
                                value={childinsurance[childInsuranceIndex].Name}
                                onChange={(e)=>this.handleChange(e, 'insurance', childInsuranceIndex)}
                            >
                                <option value="Aetna">Aetna</option>
                                <option value="Anthem">Anthem</option>
                                <option value="Buckeye Health Plan">Buckeye Health Plan</option>
                                <option value="CareSource">CareSource</option>
                                <option value="Medicaid">Medicaid</option>
                                <option value="Monila Healthcare">Monila Healthcare</option>
                                <option value="Paramount Advantage">Paramount Advantage</option>
                                <option value="United Healthcare">United Healthcare</option>
                            </FormControl>
                        </FormGroup>
                    </div>
                    <Button type="submit" className={"btn btn-primary"}>Save Changes</Button>
                </form>
            </Tab>
        );
    }

    createChildSchoolTab(child, childSchoolIndex, childschool) {
        return (
            <Tab eventKey={childSchoolIndex+"school"} title={child.Fname + ' ' + child.Lname}>
                <form onSubmit={(e) => this.handleSchoolSubmit(e, childSchoolIndex)}>
                    <div>
                        <FormGroup controlId="child_School_District" bsSize="medium">
                            <ControlLabel>School District Phone</ControlLabel>
                            {typeof childschool[childSchoolIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}
                                disabled="true"
                            >
                            </FormControl>
                            }
                            {typeof childschool[childSchoolIndex] !== "undefined" &&
                            <FormControl
                                value={childschool[childSchoolIndex].Dname}
                                disabled="true"
                            >
                            </FormControl>
                            }
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId="child_school_phone" bsSize="medium">
                            <ControlLabel>School District Phone</ControlLabel>
                            {typeof childschool[childSchoolIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}
                                disabled="true"
                            >
                            </FormControl>
                            }
                            {typeof childschool[childSchoolIndex] !== "undefined" &&
                            <FormControl
                                value={childschool[childSchoolIndex].Phone}
                                disabled="true"
                            >
                            </FormControl>
                            }
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId="child_school_email" bsSize="medium">
                            <ControlLabel>School District Email</ControlLabel>
                            {typeof childschool[childSchoolIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}
                                disabled="true"
                            >
                            </FormControl>
                            }
                            {typeof childschool[childSchoolIndex] !== "undefined" &&
                            <FormControl
                                value={childschool[childSchoolIndex].Email}
                                disabled="true"
                            >
                            </FormControl>
                            }
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId={childSchoolIndex} bsSize="medium">
                            <ControlLabel>Other School District</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder={childschool[childSchoolIndex].Name}
                                value={childschool[childSchoolIndex].Name}
                                onChange={(e)=>this.handleChange(e, 'school', childSchoolIndex)}
                            >
                                <option value="South-Western City School Dist">South-Western City School Dist</option>
                                <option value="School 2">School District 2</option>
                            </FormControl>
                        </FormGroup>
                    </div>
                    <Button type="submit" className={"btn btn-primary"}>Save Changes</Button>
                </form>
            </Tab>
        );
    }
}

export default ProfileView;