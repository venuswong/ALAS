import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel, Alert} from "react-bootstrap";
import { isMobile } from 'react-device-detect';
import "./AddUserView.css";
import Popover from "react-bootstrap/es/Popover";
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger";
import HelpBlock from "react-bootstrap/es/HelpBlock";
import {sleep} from "../helpers";
import Select from 'react-select';

const options = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Patient', label: 'Patient' },
    { value: 'Clinician', label: 'Clinician' }
];

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            email: '',
            password: '',
            confirmPassword:'',
            firstName:'',
            lastName:'',
            accountType:{ value: '', label: '' },
            showModal: false,
            delay: 10,
            showGoodRegisterAlert: false,
            showBadRegisterAlert: false,
            showErrorRegisterAlert: false,
        };

        this.handleScan = this.handleScan.bind(this);
    }

    handleScan(data) {
        if (data !== null && data.length < 100) {
            this.setState({
                serialCode: data,
            });
        }
    }
    static handleError(err){
        console.error(err)
    }

    validateForm() {
        return this.getConfirmPasswordValidationState() && this.getPasswordValidationState() && this.state.password === this.state.confirmPassword;
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        const {email, password, firstName, lastName, accountType} = this.state;

        fetch("/api/admin/add", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                accountType: accountType.value,
            })
        }).then((response) => {
            if(response.status === 200){
                this.removeRegisterAlerts();
                // responsive register alert
                sleep(250).then(() => {
                    this.setState({
                        showGoodRegisterAlert: true,
                    });
                });
                sleep(1000).then(() => {
                    this.props.history.push('/');
                })
            }
            else if(response.status === 400){
                this.removeRegisterAlerts();
                // responsive register alert
                sleep(250).then(() => {
                    this.setState({
                        showBadRegisterAlert: true,
                    });
                });
            }
            else{
                this.removeRegisterAlerts();
                // responsive register alert
                sleep(250).then(() => {
                    this.setState({
                        showErrorRegisterAlert: true
                    });
                });
            }
        })
    };

    getPasswordValidationState() {
        const password = this.state.password;
        if(password === "") return null;
        if(/[A-Z]/.test(password) && /[0-9]/.test(password) && /[A-Za-z0-9]{7,13}$/.test(password)){
            return 'success';
        } else{
            return 'error';
        }
    };

    getConfirmPasswordValidationState(){
        const password = this.state.password;
        const confirmPassword = this.state.confirmPassword;
        if(password === "" || confirmPassword === "") return null;
        if(password === confirmPassword){
            return 'success';
        } else if(password !== confirmPassword){
            return 'error';
        }
    };

    popoverRight = (
        <Popover id="popover-positioned-right" title="Hint">
            At least one CAPITAL letter. <br/>
            Only letters and numbers are allowed.
        </Popover>
    );

    removeRegisterAlerts() {
        this.setState({
            showGoodRegisterAlert: false,
            showBadRegisterAlert: false,
            showErrorRegisterAlert: false
        });
    }

    handleSelectChange = (accountType) => {
        this.setState({
            accountType
        });
        console.log(`Option selected:`, accountType);
    }

    render() {
        const {showGoodRegisterAlert, showBadRegisterAlert, showErrorRegisterAlert, accountType} = this.state;

        return (
            <div className="Login">
                {showGoodRegisterAlert &&
                    <Alert bsStyle={"success"}>
                        <strong>Success! </strong>Registering...
                    </Alert>
                }
                {showBadRegisterAlert &&
                    <Alert bsStyle={"danger"}>
                        <strong>Error! </strong>Account already existed.
                    </Alert>
                }
                {showErrorRegisterAlert &&
                    <Alert bsStyle={"warning"}>
                        <strong>Error! </strong>Something went wrong.
                    </Alert>
                }

                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="example@gmail.com"
                        />
                    </FormGroup>
                    <FormGroup controlId="firstName" bsSize="large">
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl
                            value={this.state.firstName}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="lastName" bsSize="large">
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl
                            value={this.state.lastName}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    {!isMobile &&
                        <OverlayTrigger trigger="focus" placement="right" overlay={this.popoverRight}>
                            <FormGroup controlId="password"
                                       bsSize="large"
                                       validationState={this.getPasswordValidationState()}>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    type="password"
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </OverlayTrigger>
                    }
                    {isMobile &&
                        <FormGroup controlId="password"
                                   bsSize="large"
                                   validationState={this.getPasswordValidationState()}>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                            <FormControl.Feedback />
                            <HelpBlock>At least one CAPITAL letter. <br/> Only letters and numbers are allowed.</HelpBlock>
                        </FormGroup>
                    }
                    <FormGroup controlId="confirmPassword"
                               bsSize="large"
                               validationState={this.getConfirmPasswordValidationState()}>
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <div>
                        <b>Account Type:</b>
                        <br></br>
                        <Select class={"account-type"}
                                value={accountType}
                                onChange={this.handleSelectChange}
                                options={options}
                        />
                        <br></br>
                    </div>

                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Create
                    </Button>
                </form>
            </div>
        );
    }
}

export default AddUser;