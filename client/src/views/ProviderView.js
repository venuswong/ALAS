import React, { Component } from 'react';
import {Button, FormControl, Glyphicon} from "react-bootstrap";
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
            alertProps: {
                show: false,
                message: '',
                bsStyle: '',
            }
        };
    }

    componentDidMount() {
        getChildrenProvider().then(result => result.json())
            .then(json => {
                this.setState({
                    Children_Provider: json.result
                })
            });
    }

    renderProviderCard(item, key) {
        return (
            <div class="provider-card">
                <p class="provider"><a href={item.Website}>{item.Name}</a></p>
                <div class="provider-phone">
                    <a href={item.Phone_Link}>
                        <Button className={"buttonWidth"}>
                            <span class="phone-number">{item.Phone}</span>
                            <Glyphicon glyph={"glyphicon glyphicon-earphone phone-glyph"}/>
                        </Button>
                    </a>
                </div>
                <p class="provider-address">{item.Address_Line1} {item.City}, {item.State} {item.Zip}</p>
            </div>
        );
    }

    render() {
        const {Children_Provider} = this.state;
        const self = this;
        //console.log(Children_Provider);
        return (
            <div className={"defaultview"}>
                <h3>Here are some providers that accept your insurance: </h3>
                    {Children_Provider.map(function (item, key) {
                        return self.renderProviderCard(item, key);
                    })}
            </div>
        );
    }
}

export default ProviderView;
