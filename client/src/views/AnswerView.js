import React, { Component } from 'react';
import {
    Panel,
    Button,
    Table,
    Modal,
    FormGroup,
    ControlLabel,
    FormControl, Checkbox, Alert
} from "react-bootstrap";
import {postQuestionReponse, getAskerInfo} from "../session/Session";
import {sleep} from "../helpers";

const SLEEP_TIME = 2000;

class AnswerView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            unanswered_questions: [],
            selectedQuestion: -1,
            textResponse: '',
            addToFAQ: false,
            showModal: false,
            alertProps: {
                show: false,
                message: '',
                bsStyle: '',
            },
            asker: {
                fname: '',
                lname: '',
                email: '',
            }
        };

        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleAddToFAQToggle = this.handleAddToFAQToggle.bind(this);
        this.handleTextResponseChange = this.handleTextResponseChange.bind(this);
        this.handleSubmitReponse = this.handleSubmitReponse.bind(this);
    }

    componentWillMount() {
        fetch("/api/faq/unanswered_questions", {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(resJson => {
                let unanswered_questions = [];
                for (const question in resJson) {
                    unanswered_questions.push(resJson[question]);
                }
                this.setState({
                    unanswered_questions: unanswered_questions,
                });
            });
    }

    handleShowModal(index) {
        this.setState({
            selectedQuestion: index,
            textResponse: '',
            addToFAQ: false,
            showModal: true,
        });
    }

    handleCloseModal() {
        this.setState({
            selectedQuestion: -1,
            textResponse: '',
            addToFAQ: false,
            showModal: false,
        });
    }

    handleTextResponseChange(e) {
        this.setState({
            textResponse: e.currentTarget.value,
        });
    }

    handleSubmitReponse() {
        const { unanswered_questions, selectedQuestion, textResponse, addToFAQ } = this.state;
        const QuestionID = unanswered_questions[selectedQuestion].QuestionID;
        postQuestionReponse(QuestionID, textResponse, addToFAQ).then((res) => {
            if (res.status === 200) {
                let unanswered_questions = this.state.unanswered_questions;
                unanswered_questions.splice(selectedQuestion, 1);
                this.setState({
                    unanswered_questions: unanswered_questions,
                    alertProps: {
                        show: true,
                        message: 'Successfully answered question',
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
                this.handleCloseModal();
            } else {
                this.setState({
                    alertProps: {
                        show: true,
                        message: 'Unable to submit answer',
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
    }

    handleAddToFAQToggle() {
        this.setState({
            addToFAQ: !this.state.addToFAQ,
        });
    }

    createModal() {
        const {textResponse} = this.state;
        const question = this.state.unanswered_questions[this.state.selectedQuestion];

        return (
            <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{question.Question}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Answer:</ControlLabel>
                        <FormControl componentClass="textarea"
                                     style={{ height: 200 }}
                                     value={textResponse}
                                     onChange={this.handleTextResponseChange}
                                     placeholder="Type your response here..."
                        />
                        <Checkbox onClick={this.handleAddToFAQToggle}>Add to FAQ?</Checkbox>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleCloseModal}>Cancel</Button>
                    <a onClick={this.handleSubmitReponse} href={'mailto:' + question.Email + "?subject=" + question.Question + "&body=" + textResponse}><Button>Submit</Button></a>
                </Modal.Footer>
            </Modal>
        );
    }

    createPanelFromQuestion(question, index) {
        const {showModal} = this.state;
        return (
            <div>
                <Panel>
                    <Panel.Body>
                        <Table>
                            <tbody>
                            <td>
                                Question: {question.Question}
                            </td>
                            <td>
                                Asked by: {question.Fname + " " + question.Lname}
                            </td>
                            <td>
                                <Button bsStyle="primary" bsSize="large" onClick={() => this.handleShowModal(index)}>
                                    Answer Question
                                </Button>
                            </td>
                            </tbody>
                        </Table>
                    </Panel.Body>
                </Panel>
                { showModal && this.createModal() }
            </div>
        );
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

    render() {
        const {unanswered_questions} = this.state;
        return (
            <div className={"defaultview"}>
                {this.displayAlert()}
                <h2>Answer Questions</h2>
                {unanswered_questions.length > 0 &&
                    unanswered_questions.map(
                        (question, index) => {
                            return this.createPanelFromQuestion(question, index);
                        }
                    )
                }
                {unanswered_questions.length <= 0 &&
                    <h4>There are currently no questions to answer.</h4>
                }
            </div>
        );
    }
}

export default AnswerView;

