import React, { Component } from "react";
import { Alert, Button, FormGroup, FormControl, ControlLabel, InputGroup, Glyphicon } from "react-bootstrap";
import "./Login.css";
import ReactModal from 'react-modal';
import QrReader from "react-qr-reader";
import {sleep} from "../helpers";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            serialCode:"",
            Language: "",
			showModal: false,
            delay: 10,
            showGoodLoginAlert: false,
            showBadLoginAlert: false,
			showBadAutofillAlert: false,
            showErrorLoginAlert: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		
		this.handleScan = this.handleScan.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

	handleScan(data) {
        if (data !== null && data.length < 100) {
            this.setState({
                serialCode: data,
            });
			
			const {serialCode} = this.state;
			fetch("/api/login/autofill", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},

				// Serialize JSON body
				body: JSON.stringify({
					serialCode: serialCode
				})
			})
			.then((result) => {
				if (result.status === 200) {
					this.removeLoginAlerts();
					result.json().then(json => {
					//	console.log("okay " + json.Autofill_Email);
						this.setState({
							email: json.Autofill_Email,
						});
					});
				} else if (result.status === 401) {
					this.removeLoginAlerts();
					// responsive login alert
					sleep(250).then(() => {
					   this.setState({
						   showBadAutofillAlert: true,
					   });
					});
				} else {
					this.removeLoginAlerts();
					// responsive login alert
					sleep(250).then(() => {
						this.setState({
							showErrorLoginAlert: true
						});
					});
				}
			});
        }
    }
    static handleError(err){
        console.error(err)
    }

    handleOpenModal () {
        this.setState({ email: '', showModal: true, serialCode:'' });

    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }
	
    validateForm() {
        // NEEDS MORE VALIDATION
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    removeLoginAlerts() {
        this.setState({
            showGoodLoginAlert: false,
            showBadLoginAlert: false,
			showBadAutofillAlert: false,
            showErrorLoginAlert: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {email, password} = this.state;
        fetch("/api/login/login", {
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
        })
        .then((result) => {
            if (result.status === 200) {
                result.json().then(json =>
                    cookies.set("googtrans", json.Language, {path: '/'})
                );
                this.removeLoginAlerts();
                // responsive login alert
                sleep(250).then(() => {
                    this.setState({
                        showGoodLoginAlert: true,
                    });
                });
                sleep(1000).then(() => {
                    // this.props.history.push('/');
                    window.location.href = '/';
                })
            } else if (result.status === 401) {
                this.removeLoginAlerts();
                // responsive login alert
                sleep(250).then(() => {
                   this.setState({
                       showBadLoginAlert: true,
                   });
                });
            } else {
                this.removeLoginAlerts();
                // responsive login alert
                sleep(250).then(() => {
                    this.setState({
                        showErrorLoginAlert: true
                    });
                });
            }
        });
    }

    render() {
        const {showGoodLoginAlert, showBadLoginAlert, showBadAutofillAlert, showErrorLoginAlert} = this.state;
        return (
            <div className="login">
                {showGoodLoginAlert &&
                    <Alert bsStyle={"success"}>
                        <strong>Success! </strong>Logging you in...
                    </Alert>
                }
                {showBadLoginAlert &&
                    <Alert bsStyle={"danger"}>
                        <strong>Error! </strong>Login information is incorrect.
                    </Alert>
                }
				{showBadAutofillAlert &&
                    <Alert bsStyle={"danger"}>
                        <strong>Error! </strong>Invalid QR Code.
                    </Alert>
                }
                {showErrorLoginAlert &&
                    <Alert bsStyle={"warning"}>
                        <strong>Error! </strong>Something went wrong.
                    </Alert>
                }
                <form onSubmit={this.handleSubmit}>
					<FormGroup controlId="email" bsSize="large">
                        <InputGroup bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                value={this.state.email}
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
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}

export default Login;