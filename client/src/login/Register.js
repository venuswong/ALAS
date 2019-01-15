import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel, InputGroup, Glyphicon, Alert} from "react-bootstrap";
import { isMobile } from 'react-device-detect';
import "./Register.css";
import ReactModal from 'react-modal';
import Popover from "react-bootstrap/es/Popover";
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger";
import HelpBlock from "react-bootstrap/es/HelpBlock";
import "../views/DefaultView.css";
import QrReader from "react-qr-reader";
import {sleep} from "../helpers";

class Register extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            email: '',
            password: '',
            confirmPassword:'',
            serialCode:'',
            showModal: false,
            delay: 10,
            showGoodRegisterAlert: false,
            showBadRegisterAlert: false,
            showErrorRegisterAlert: false
        };

        this.handleScan = this.handleScan.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
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

    handleOpenModal () {
        this.setState({ showModal: true, serialCode:'' });

    }

    handleCloseModal () {
        this.setState({ showModal: false });
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
        const {email, password} = this.state;
        fetch("/api/login/register", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            // Serialize JSON body
            body: JSON.stringify({
                email: email,
                password: password
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

    render() {
        const {showGoodRegisterAlert, showBadRegisterAlert, showErrorRegisterAlert} = this.state;

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
                    <div>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                value={this.state.email}
                                onChange={this.handleChange}
                                placeholder="example@gmail.com"
                            />
                        </FormGroup>
                    </div>
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
                    <FormGroup controlId="serialCode" bsSize="large">
                        <InputGroup bsSize="large">
                            <ControlLabel>Serial Code</ControlLabel>
                            <FormControl
                                value={this.state.serialCode}
                                onChange={this.handleChange}
                                className="test"
                            />
                            <InputGroup.Button>
                                <Button type="button" className={"btn btn-outline-secondary"} onClick={this.handleOpenModal}><Glyphicon glyph="barcode"/></Button>
                            </InputGroup.Button>
                            {!this.state.serialCode &&
                            <ReactModal
                                isOpen={this.state.showModal}
                                contentLabel="Minimal Modal Example"
                                className="Modal"
                            >
                                <button onClick={this.handleCloseModal}>&#x2716;</button>
                                <div className={"scan"}>
                                    <QrReader
                                        delay={this.state.delay}
                                        className={"qrscan"}
                                        onError={this.handleError}
                                        onScan={this.handleScan}
                                    />
                                </div>
                            </ReactModal>
                            }
                        </InputGroup>
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
            </div>
        );
    }
}

export default Register;