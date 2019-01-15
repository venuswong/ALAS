import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar';
import "./FAQView.css";
import {Panel, FormControl, FormGroup, Form, Grid, Row, Col, ControlLabel} from "react-bootstrap";
import PanelGroup from "react-bootstrap/es/PanelGroup";
import Button from "react-bootstrap/es/Button";
import ReactModal from 'react-modal';
import {isUserLoggedIn} from "../session/Session";

class FAQView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questions: [],
            searchQuery: "",
            isSearching: false,
            question_open: false,
            showModal: false,
            question_value: '',
            isUserLoggedIn: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit_q = this.handleSubmit_q.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleModal () {
        this.setState({ showModal: !this.state.showModal});
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };


    componentWillMount() {
        isUserLoggedIn().then(result => {
            if (result.status === 200) {
                this.setState({
                    isUserLoggedIn: true,
                });
            }
        });
    }

    componentDidMount() {
        fetch('/api/faq/get-questions')
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson);
                let questions = [];
                for (const question in resJson) {
                    questions.push(resJson[question]);
                }
                this.setState({
                    questions: questions,
                    isSearching: false,
                });
            })
    }

    handleSubmit() {
        fetch('/api/faq/get-questions')
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson);
                let questions = [];
                for (const question in resJson) {
                    let questionTitle = resJson[question].Question;
                    if(questionTitle.includes(this.state.searchQuery)){
                        questions.push(resJson[question]);
                        // update question frequency
                        if(this.state.searchQuery !== ""){
                            fetch('/api/faq/update-frequency', {
                                method: "post",
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    newQuestion: questionTitle
                                })
                            })
                        }
                    }
                }
                this.setState({
                    questions: questions
                });
            })
    }

    handleDelete(){
        fetch('/api/faq/get-questions')
            .then(res => res.json())
            .then(resJson => {
                let questions = [];
                for (const question in resJson) {
                    questions.push(resJson[question]);
                }
                this.setState({
                    questions: questions
                });
            })
    }

    handleSubmit_q() {
        const {question_value} = this.state;

        fetch('/api/faq/new-question', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question_value: question_value
            })
        })
    }

    render() {
        const { questions, isUserLoggedIn } = this.state;

        return (
            <div className={"defaultview"}>
                <ReactModal
                    isOpen={this.state.showModal}
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <button onClick={this.handleModal}>&#x2716;</button>
                    <div>
                        <p><br/></p>
                        <Form onSubmit={this.handleSubmit_q}>
                            <FormGroup controlId="question_value" bsSize="large">
                                <ControlLabel>What is your question?</ControlLabel>
                                <FormControl
                                    value={this.state.question_value}
                                    onChange={this.handleChange}
                                    placeholder="Your Question Here"
                                />
                            </FormGroup>
                            <Button type="submit" className="modal-space btn btn-primary">Submit</Button>
                        </Form>
                    </div>
                </ReactModal>
                <Grid>
                    <Row className="row-eq-height">
                            <Col xs={12} sm={12} md={12} lg={12} className="padcol">
                                <SearchBar className={"search-bar"}
                                           onChange={(newValue) => this.setState({searchQuery: newValue})}
                                           onRequestSearch={this.handleSubmit}
                                           onCancelSearch={this.handleDelete}
                                           spellCheck={true}
                            />
                        </Col>
                    </Row>
                </Grid>
                <PanelGroup>
                    {
                        questions.map(
                            (question) => {
                                return (
                                    <Panel className={"question"}>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3" toggle>{question.Question}</Panel.Title>
                                        </Panel.Heading>
                                        <Panel.Body collapsible>{question.Answer}</Panel.Body>
                                    </Panel>
                                );
                            }
                        )
                    }
                    {isUserLoggedIn &&
                    <Col xs={4} sm={4} md={4} lg={4} className="padcol">
                        <Button className="askaq MuiPaper-elevation2-13 MuiPaper-rounded-10"
                                onClick={this.handleModal}>Ask a new question?</Button>
                    </Col>
                    }
                </PanelGroup>
            </div>
        );
    }
}

export default FAQView;