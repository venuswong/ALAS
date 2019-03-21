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

    render() {
        const {Children_Provider} = this.state;
        const self = this;
        //console.log(Children_Provider);
        return (
            <div className={"defaultview"}>
                <h3>Here are some providers that accept your insurance: </h3>
                <table>
                    <tbody>
                    <tr>
                        <th>Provider</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Distance</th>
                        <th>Add to List</th>
                    </tr>
                    {Children_Provider.map(function (item, key) {
                        return (
                            <tr key={key} id={item.Prov_ID}>
                                <td class="provider"><a href={item.Website}>{item.Name}</a></td>
                                <td>{item.Phone}
                                    <a href={item.Phone_Link}>
                                        <Button className={"buttonWidth"}>
                                            <Glyphicon glyph={"glyphicon glyphicon-earphone phone-glyph"}/>
                                        </Button>
                                    </a>
                                </td>
                                <td>{item.Address_Line1} {item.City}, {item.State} {item.Zip}</td>
                                <td>{item.Zip}</td>
                                <td>
                                    <form>
                                        <input id={"shortlist"} type={"checkbox"}/>
                                    </form>
                                </td>
                            </tr>
                        )
                    })}</tbody>
                </table>
            </div>
        );
    }
}

export default ProviderView;