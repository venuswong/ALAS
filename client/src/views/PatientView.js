import React, { Component } from 'react';
import PanelGroup from "react-bootstrap/es/PanelGroup";
import Panel from "react-bootstrap/es/Panel";
import ButtonGroup from "react-bootstrap/es/ButtonGroup";
import {Button} from "react-bootstrap";
import ProgressBar from "react-bootstrap/es/ProgressBar";


class PatientView extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            activeKey: '1'
        };
    }

    handleSelect(activeKey) {
        this.setState({ activeKey });
    }

    render() {
        return (
            <div className={"defaultview"}>
                <PanelGroup
                    accordion
                    id="accordion-controlled-example"
                    activeKey={this.state.activeKey}
                    onSelect={this.handleSelect}
                >
                    <Panel eventKey="1"
                           bsStyle="success">
                        <Panel.Heading>
                            <Panel.Title toggle>Patient 1</Panel.Title>
                            <div><p></p></div>
                            <ProgressBar active bsStyle="success" now={100} label={`${100}%`} />
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <ButtonGroup>
                                <Button bsSize="large" bsStyle="success">Action 1</Button>
                                <Button bsSize="large" bsStyle="success">Action 2</Button>
                                <Button bsSize="large" bsStyle="success">Action 3</Button>
                                <Button bsSize="large" bsStyle="success">Action 4</Button>
                                <Button bsSize="large" bsStyle="info">Learn More!</Button>
                            </ButtonGroup>
                        </Panel.Body>
                    </Panel>

                    <Panel eventKey="2"
                           bsStyle="warning">
                        <Panel.Heading>
                            <Panel.Title toggle>Patient 2</Panel.Title>
                            <div><p></p></div>
                            <ProgressBar active bsStyle="warning" now={75} label={`${75}%`} />
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <ButtonGroup>
                                <Button bsSize="large" bsStyle="success">Action 1</Button>
                                <Button bsSize="large" bsStyle="danger">Action 2</Button>
                                <Button bsSize="large" bsStyle="success">Action 3</Button>
                                <Button bsSize="large" bsStyle="success">Action 4</Button>
                                <Button bsSize="large" bsStyle="info">Learn More!</Button>
                            </ButtonGroup>
                        </Panel.Body>
                    </Panel>

                    <Panel eventKey="3"
                           bsStyle="warning">
                        <Panel.Heading>
                            <Panel.Title toggle>Patient 3</Panel.Title>
                            <div><p></p></div>
                            <ProgressBar active bsStyle="warning" now={50} label={`${50}%`} />
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <ButtonGroup>
                                <Button bsSize="large" bsStyle="success">Action 1</Button>
                                <Button bsSize="large" bsStyle="danger">Action 2</Button>
                                <Button bsSize="large" bsStyle="success">Action 3</Button>
                                <Button bsSize="large" bsStyle="danger">Action 4</Button>
                                <Button bsSize="large" bsStyle="info">Learn More!</Button>
                            </ButtonGroup>
                        </Panel.Body>
                    </Panel>

                    <Panel eventKey="4"
                           bsStyle="danger">
                        <Panel.Heading>
                            <Panel.Title toggle>Patient 4</Panel.Title>
                            <div><p></p></div>
                            <ProgressBar active bsStyle="danger" now={25} label={`${25}%`} />
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <ButtonGroup>
                                <Button bsSize="large" bsStyle="danger">Action 1</Button>
                                <Button bsSize="large" bsStyle="danger">Action 2</Button>
                                <Button bsSize="large" bsStyle="success">Action 3</Button>
                                <Button bsSize="large" bsStyle="danger">Action 4</Button>
                                <Button bsSize="large" bsStyle="info">Learn More!</Button>
                            </ButtonGroup>
                        </Panel.Body>
                    </Panel>
                </PanelGroup>
            </div>
        );
    }
}

export default PatientView;