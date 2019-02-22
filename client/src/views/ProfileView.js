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
import Panel from "react-bootstrap";
import PanelHeading from "react-bootstrap/es/PanelHeading";
import PanelBody from "react-bootstrap/es/PanelBody";




import {
    isUserLoggedIn,
    getProfile,
    getUserFirstName,
    getChildrenInfo,
    getChildrenInsurance,
    getChildrenProvider,
    getChildrenSchool,
    getSD_in_ZipCode,
    postQuestionReponse, postChildInsurance, postChildProvider, postChildSchool, getSchoolDistrict
} from "../session/Session";
import Cookies from 'universal-cookie';
import {sleep} from "../helpers";

const cookies = new Cookies();
const SLEEP_TIME = 2000;

class ProfileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SelectedDistrict: [],
            Uid: '',
            Account_Type: '',
            Fname: '',
            Lname: '',
            Local_Hold: [],
            Email: '',
            Password: '',
            Picture: '',
            Language: '',
            Children_Information: [],
            Children_Insurance: [],
            Local_Districts: [],
            Children_Provider: [],
            Children_School: [],
            alertProps: {
                show: false,
                message: '',
                bsStyle: '',
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInsuranceSubmit = this.handleInsuranceSubmit.bind(this);
        this.handleSchoolSubmit = this.handleSchoolSubmit.bind(this);
        this.handleProviderSubmit = this.handleProviderSubmit.bind(this);
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
            newArray[childDataIndex].IName = event.target.value;
            this.setState({
                Children_Insurance: newArray
            });
        } else if (dataType === 'provider') {
            let newArray = Object.assign(this.state.Children_Provider);
            newArray[childDataIndex].Name = event.target.value;
            this.setState({
                Children_Provider: newArray
            });
        } else {
            this.state.SelectedDistrict[childDataIndex] = event.target.value;
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

    handleProviderSubmit(e, childProviderIndex) {
        console.log('got here');
        const { Children_Information, Children_Provider} = this.state;
        e.preventDefault();
        postChildInsurance(Children_Information[childProviderIndex], Children_Provider[childProviderIndex]).then((res) => {
            if (res.status === 200) {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Successfully changed provider',
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
                        message: 'Unable to change provider',
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
        // console.log(this.state.SelectedDistrict[childSchoolIndex])
        postChildSchool(Children_Information[childSchoolIndex], this.state.SelectedDistrict[childSchoolIndex]).then((res) => {
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
        window.location.reload();
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
                    }, () => { // After the children info has been updated, get the school districts for them
                        this.getDistricts();
                    })

                });
            getChildrenInsurance().then(result => result.json())
                .then(json => {
                    this.setState({
                        Children_Insurance: json.result
                    })
                });
            getChildrenProvider().then(result => result.json())
                .then(json => {
                    this.setState({
                        Children_Provider: json.result
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

    getDistricts() {
        for (let child in this.state.Children_Information) {

            getSD_in_ZipCode(this.state.Children_Information[child].PIid)
                .then(schoolDistrictInfo => schoolDistrictInfo.json())
                .then(schoolDistrictJson => {
                    let Local_Districts = Object.assign(this.state.Local_Districts);
                    Local_Districts = schoolDistrictJson;

                    this.setState({
                        Local_Districts
                    });
                    if(this.state.Children_Information[child].SDIid !== Local_Districts[0].SDIid) {
                        this.state.SelectedDistrict[child] = Local_Districts[0].SDIid
                    }
                    else{
                        this.state.SelectedDistrict[child] = Local_Districts[1].SDIid
                    }
                });
        }
    }

    render() {
        const {Children_Information, Children_Insurance, Children_Provider, Children_School, Local_Districts} = this.state;
        let childInsuranceIndex = 0;
        let childProviderIndex = 0;
        let childSchoolIndex = 0;
        return (
            <div className={"defaultview"}>
                {this.displayAlert()}
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={4}>
                            <Nav bsStyle="pills" stacked>
                                <NavItem eventKey="first">Account Information</NavItem>
                                <NavItem eventKey="second">Child Information</NavItem>
                                <NavItem eventKey="third">School Information</NavItem>
                                <NavItem eventKey="fourth">Provider Information</NavItem>
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
                                                    disabled="true"
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
                                                        return this.createChildSchoolTab(child, childSchoolIndex++, Children_School, Local_Districts);
                                                    }
                                                })
                                        }
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="fourth">
                                    <Tabs id="child-provider-tabs">
                                        {
                                            Children_Information.map(
                                                (child) => {
                                                    if (Children_Provider[childProviderIndex]) {
                                                        return this.createChildProviderTab(child, childProviderIndex++, Children_Provider);
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

    createChildInfoTab(child, childInsuranceIndex, childinsurance){
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
                                placeholder={childinsurance[childInsuranceIndex].IName}
                                value={childinsurance[childInsuranceIndex].IName}
                                onChange={(e)=>this.handleChange(e, 'insurance', childInsuranceIndex)}
                            >
                                <option value="Aetna">Aetna</option>
                                <option value="Anthem">Anthem</option>
                                <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                                <option value="Buckeye Health Plan">Buckeye Health Plan</option>
                                <option value="CareSource">CareSource</option>
                                <option value="Choice Care">Choice Care</option>
                                <option value="Medicaid">Medicaid</option>
                                <option value="Medical Mutual">Medical Mutual</option>
                                <option value="Medicare">Medicare</option>
                                <option value="Molina Healthcare">Molina Healthcare</option>
                                <option value="Ohio State">Ohio State</option>
                                <option value="Paramount Advantage">Paramount Advantage</option>
                                <option value="Tricare">Tricare</option>
                                <option value="United Healthcare">United Healthcare</option>
                                <option value="None">None (private pay)</option>
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId={this.childProviderIndex} bsSize="medium">
                            <ControlLabel>Provider</ControlLabel>
                            <FormControl
                                componentClass="select"
                                //placeholder={childprovider[childProviderIndex].Name}
                                //value={childprovider[childProviderIndex].Name}
                                //onChange={(e)=>this.handleChange(e, 'provider', childProviderIndex)}
                            >
                                <option value="A.B.L.E. Academic and Behavioral Learning Enrichment">A.B.L.E. Academic and Behavioral Learning Enrichment</option>
                                <option value="Amigo Family Counseling">Amigo Family Counseling</option>
                                <option value="Amy Boland, PhD">Amy Boland, PhD</option>
                                <option value="Boundless">Boundless</option>
                                <option value="Bridgeway Academy">Bridgeway Academy</option>
                                <option value="Center for Autism Spectrum Disorder">Center for Autism Spectrum Disorder</option>
                                <option value="Development Associates">Development Associates</option>
                                <option value="Directions Counseling">Directions Counseling</option>
                                <option value="Faith Hope and Love Intervention Services">Faith Hope and Love Intervention Services</option>
                                <option value="Flourish Integrated Therapy">Flourish Integrated Therapy</option>
                                <option value="Haugland Learning Center">Haugland Learning Center</option>
                                <option value="Hopebridge Autism Therapy Centers">Hopebridge Autism Therapy Centers</option>
                                <option value="Janet Hansen, PhD">Janet Hansen, PhD</option>
                                <option value="Julie Canfield, PsyD">Julie Canfield, PsyD</option>
                                <option value="Kari S. Watts, PhD">Kari S. Watts, PhD</option>
                                <option value="Keith G. Hughes, PhD">Keith G. Hughes, PhD</option>
                                <option value="Oakstone Academy">Oakstone Academy</option>
                                <option value="Ohio State University Nisonger Center">Ohio State University Nisonger Center</option>
                                <option value="Pathfinder Progress">Pathfinder Progress</option>
                                <option value="Reach Educational Services">Reach Educational Services</option>
                                <option value="The Center for Cognitive and Behavioral Therapy of Greater Columbus">The
                                    Center for Cognitive and Behavioral Therapy of Greater Columbus</option>
                                <option value="The Learning Spectrum">The Learning Spectrum</option>
                                <option value="The Silver Lining Group">The Silver Lining Group</option>
                                <option value="Total Education Solutions">Total Education Solutions</option>
                                <option value="Trumpet Behavioral Health">Trumpet Behavioral Health</option>
                            </FormControl>
                        </FormGroup>
                    </div>
                    <Button type="submit" className={"btn btn-primary"}>Save Changes</Button>
                </form>
            </Tab>
        );
    }

    createChildProviderTab(child, childProviderIndex, childprovider) {
        return (
            <Tab eventKey={childProviderIndex+"school"} title={child.Fname + ' ' + child.Lname}>
                <form onSubmit={(e) => this.handleProviderSubmit(e, childProviderIndex)}>
                    <div>
                        <FormGroup controlId={this.childProviderIndex} bsSize="medium">
                            <ControlLabel>Provider</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder={childprovider[childProviderIndex].Name}
                                value={childprovider[childProviderIndex].Name}
                                //onChange={(e)=>this.handleChange(e, 'provider', childProviderIndex)}
                            >
                                <option value="A.B.L.E. Academic and Behavioral Learning Enrichment">A.B.L.E. Academic and Behavioral Learning Enrichment</option>
                                <option value="Amigo Family Counseling">Amigo Family Counseling</option>
                                <option value="Amy Boland, PhD">Amy Boland, PhD</option>
                                <option value="Boundless">Boundless</option>
                                <option value="Bridgeway Academy">Bridgeway Academy</option>
                                <option value="Center for Autism Spectrum Disorder">Center for Autism Spectrum Disorder</option>
                                <option value="Development Associates">Development Associates</option>
                                <option value="Directions Counseling">Directions Counseling</option>
                                <option value="Faith Hope and Love Intervention Services">Faith Hope and Love Intervention Services</option>
                                <option value="Flourish Integrated Therapy">Flourish Integrated Therapy</option>
                                <option value="Haugland Learning Center">Haugland Learning Center</option>
                                <option value="Hopebridge Autism Therapy Centers">Hopebridge Autism Therapy Centers</option>
                                <option value="Janet Hansen, PhD">Janet Hansen, PhD</option>
                                <option value="Julie Canfield, PsyD">Julie Canfield, PsyD</option>
                                <option value="Kari S. Watts, PhD">Kari S. Watts, PhD</option>
                                <option value="Keith G. Hughes, PhD">Keith G. Hughes, PhD</option>
                                <option value="Oakstone Academy">Oakstone Academy</option>
                                <option value="Ohio State University Nisonger Center">Ohio State University Nisonger Center</option>
                                <option value="Pathfinder Progress">Pathfinder Progress</option>
                                <option value="Reach Educational Services">Reach Educational Services</option>
                                <option value="The Center for Cognitive and Behavioral Therapy of Greater Columbus">The
                                    Center for Cognitive and Behavioral Therapy of Greater Columbus</option>
                                <option value="The Learning Spectrum">The Learning Spectrum</option>
                                <option value="The Silver Lining Group">The Silver Lining Group</option>
                                <option value="Total Education Solutions">Total Education Solutions</option>
                                <option value="Trumpet Behavioral Health">Trumpet Behavioral Health</option>
                            </FormControl>
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId="child_provider" bsSize="medium">
                            <ControlLabel>Provider Name</ControlLabel>
                            {typeof childprovider[childProviderIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}
                                disabled="true"
                            >
                            </FormControl>
                            }
                            {typeof childprovider[childProviderIndex] !== "undefined" &&
                            <FormControl
                                value={childprovider[childProviderIndex].Name}
                                disabled="true"
                            >
                            </FormControl>
                            }
                        </FormGroup>
                    </div>
                    <Button type="submit" className={"btn btn-primary"}>Save Changes</Button>
                </form>
            </Tab>
        );
    }

    createChildSchoolTab(child, childSchoolIndex, childschool, Local_Districts) {
        return (
            <Tab eventKey={childSchoolIndex+"school"} title={child.Fname + ' ' + child.Lname}>
                <form onSubmit={(e) => this.handleSchoolSubmit(e, childSchoolIndex)}>

                    <div>
                        <FormGroup controlId="child_School_District" bsSize="medium">
                            <ControlLabel>School District</ControlLabel>
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
                        <FormGroup controlId="Address" bsSize="medium">
                            <ControlLabel>Address</ControlLabel>
                            {typeof childschool[childSchoolIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}
                                disabled="true"
                            >
                            </FormControl>
                            }
                            {typeof childschool[childSchoolIndex] !== "undefined" &&
                            <FormControl
                                value={childschool[childSchoolIndex].SD_Address +" "+ childschool[childSchoolIndex].City + ", " + childschool[childSchoolIndex].State + " " + childschool[childSchoolIndex].SD_Zip}
                                disabled="true"
                            >
                            </FormControl>
                            }
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup controlId="child_school_phone" bsSize="medium">
                            <ControlLabel>Phone</ControlLabel>
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
                            <ControlLabel>Email</ControlLabel>
                            {typeof childschool[childSchoolIndex] === "undefined" &&
                            <FormControl
                                value={"Undefined"}

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
                    <div className="informationPanel">
                    </div>
                    <div>
                        <FormGroup controlId={childSchoolIndex} bsSize="medium">
                            <ControlLabel>Other School Districts</ControlLabel>
                            <FormControl
                                componentClass="select"
                                ref = "hold"
                                placeholder={childschool[childSchoolIndex].Name}
                                value={childschool[childSchoolIndex].Name}
                                onChange={(e)=>this.handleChange(e, 'school', childSchoolIndex)}
                            >
                                {typeof Local_Districts[0] !== "undefined" &&  Local_Districts[0].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[0].SDIid}>{Local_Districts[0].Dname}</option>
                                }
                                {typeof Local_Districts[1] !== "undefined" && Local_Districts[1].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[1].SDIid}>{Local_Districts[1].Dname }</option>
                                }
                                {typeof Local_Districts[2] !== "undefined" && Local_Districts[2].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[2].SDIid}>{Local_Districts[2].Dname}</option>
                                }
                                {typeof Local_Districts[3] !== "undefined" && Local_Districts[3].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[3].SDIid}>{Local_Districts[3].Dname}</option>
                                }
                                {typeof Local_Districts[4] !== "undefined" && Local_Districts[4].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[4].SDIid}>{Local_Districts[4].Dname}</option>
                                }
                                {typeof Local_Districts[5] !== "undefined" && Local_Districts[5].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[5].SDIid}>{Local_Districts[5].Dname}</option>
                                }
                                {typeof Local_Districts[6] !== "undefined" && Local_Districts[6].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[6].SDIid}>{Local_Districts[6].Dname}</option>
                                }
                                {typeof Local_Districts[7] !== "undefined" && Local_Districts[7].Dname !== childschool[childSchoolIndex].Dname &&
                                <option
                                    value={Local_Districts[7].SDIid}>{Local_Districts[7].Dname}</option>
                                }
                            </FormControl>
                        </FormGroup>

                    </div>
                    <Button type="submit" className={"btn btn-primary"}>Change District</Button>
                </form>
            </Tab>
        );
    }}

export default ProfileView;