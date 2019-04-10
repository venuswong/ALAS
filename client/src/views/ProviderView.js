import React, { Component } from 'react';
import {Button, FormControl, Glyphicon, Modal} from "react-bootstrap";
import "./ProviderView.css"
import {
    //isUserLoggedIn,
    //getProfile,
    //getUserFirstName,
    //getChildrenInfo,
    getChildrenInsurance,
    getChildrenProvider,
    //getChildrenSchool,
    //postQuestionReponse, postChildInsurance, postChildProvider, postChildSchool
} from "../session/Session";

class ProviderView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Children_Insurance: [],
            Children_Provider: [],
            providerPages: [],
            modal: false,
            providerScript: require('../action/ActionText').ABA_GET.phoneScript,
            currentPage: 0,
            numberOfPages: 0,
            alertProps: {
                show: false,
                message: '',
                bsStyle: '',
            }
        };

        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    paginateProviders() {
        let providersPerPage = 6;
        let providerPages = [];
        let numberOfPages = Math.ceil(this.state.Children_Provider.length / providersPerPage);
        this.setState({
            numberOfPages: numberOfPages
        });
        let page = 1;
        while (page < numberOfPages) {
            providerPages[page - 1] = this.state.Children_Provider.splice(0, providersPerPage);
            page ++;
        }
        // put remainder on last page
        if (this.state.Children_Provider.length > 0) {
            providerPages[page - 1] = this.state.Children_Provider.splice(0, this.state.Children_Provider.length);
        }
        return providerPages;
    }

    componentWillMount() {
        getChildrenProvider().then(result => result.json())
            .then(json => {
                this.setState({
                    Children_Provider: json.result
                }, () => {
                    this.setState({
                        providerPages: this.paginateProviders()
                    }, () => {
                        console.log(this.state.providerPages);
                    });
                });
            });
    }

    renderProviderCard(item, key) {
        return (
            <div class="provider-card">
                <p class="provider"><a href={item.Website}>{item.Name}</a></p>
                <div class="provider-phone">
                    <Button className="btn btn-default provider-call-button">
                        <span class="phone-number">{item.Phone}</span>
                        <Glyphicon glyph={"glyphicon glyphicon-earphone phone-glyph"}/>
                    </Button>
                    <a href={item.Phone_Link}/>
                </div>
                <p class="provider-address">{item.Address_Line1} {item.City}, {item.State} {item.Zip}</p>
            </div>
        );
    }

    goToPrevPage() {
        let prevPage = this.state.currentPage - 1;
        if (prevPage >= 0) {
            this.setState({
                currentPage: prevPage
            });
        }
    }

    goToNextPage() {
        let nextPage = this.state.currentPage + 1;
        if (nextPage < this.state.numberOfPages) {
            this.setState({
                currentPage: nextPage
            });
        }
    }

    closeModal() {
        this.setState({modal: false});
    }

    openModal(e) {
        e.preventDefault();
        this.setState({modal: true});
    }


    render() {
        const self = this;
        let leftButtonStyling = this.state.currentPage === 0 ?
            'btn btn-default prev-button-disabled' : 'btn btn-default prev-button';
        let rightButtonStyling = this.state.currentPage + 1 === this.state.numberOfPages ?
            'btn btn-default next-button-disabled' : 'btn btn-default next-button';
        console.log(this.state.Children_Provider);
        console.log(this.state.providerPages);
        return (
            <div className={"defaultview"}>
                <h3>Here are some ABA providers that accept your insurance: </h3>
                <div className="page-buttons">
                    <button onClick={this.goToPrevPage} className={leftButtonStyling}>Prev</button>
                    <button onClick={this.goToNextPage} className={rightButtonStyling}>Next</button>
                    <p>Page {this.state.currentPage + 1} of {this.state.numberOfPages}</p>
                </div>
                <a href="" onClick={this.openModal}>Ready to call but don't know what to say?</a>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sample Phone Script For ABA Providers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.providerScript}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <div class="provider-container">
                    {this.state.providerPages[this.state.currentPage] &&
                        <div class="provider-cards">
                            {this.state.providerPages[this.state.currentPage].map(function (item, key) {
                                return self.renderProviderCard(item, key);
                            })}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default ProviderView;
