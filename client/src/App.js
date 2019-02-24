import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Sidenav from "./common/Sidenav"
import Header from "./common/Header";
import Footer from "./common/Footer";
import HomeView from "./views/HomeView";
import ActionView from "./action/ActionView";
import ClinicianView from "./clinician/ClinicianView";
import ProfileView from "./views/ProfileView";
import AboutView from "./views/AboutView";
import Login from "./login/Login";
import Register from "./login/Register";
import {getUserAccountType, isUserLoggedIn} from "./session/Session";
import AdminView from "./views/AdminView";
import PatientView from "./views/PatientView";
import Logout from "./login/Logout";
import Loading from "./common/Loading";
import FAQView from "./views/FAQView";
import AnswerView from "./views/AnswerView";
import PageNotFound from "./common/PageNotFound";
import ProviderView from "./views/ProviderView";
import './App.css';
import './common/Sidenav.css';
import AddUser from "./views/AddUserView";

class App extends Component {
    SIDENAV_WIDTH = "210px";

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            isUserLoggedIn: false,
            isSidenavVisible: false,
            accountType: null,
            sidenavStyle: {
                width:"0"
            }
        };

        this.sidenavToggle = this.sidenavToggle.bind(this);
        this.sidenavClose = this.sidenavClose.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getRouterOptions = this.getRouterOptions.bind(this);
    }

    componentDidMount() {
        isUserLoggedIn().then(loggedInResult => {
            if (loggedInResult.status === 200) {
                this.setState({
                    isUserLoggedIn: true,
                });
                getUserAccountType().then(accountTypeResult => {
                    if (accountTypeResult.status === 200) {
                        accountTypeResult.json().then(accountTypeJson => {
                            this.setState({
                                accountType: accountTypeJson.Account_Type,
                            });
                        })
                    }
                });
            }
            this.setState({
                loading: false,
            });
        });
    }

    /* Toggle width of the side navigation between 0 and {SIDENAV_WIDTH} */
    sidenavToggle() {
        if (this.state.sidenavStyle.width === "0") {
            this.setState({
                sidenavStyle: {
                    width:this.SIDENAV_WIDTH,
                },
            });
        } else {
            this.setState({
                sidenavStyle: {
                    width:"0",
                }
            });
        }
    }

    sidenavClose() {
        if (this.state.sidenavStyle.width === this.SIDENAV_WIDTH) {
            this.setState({
                sidenavStyle: {
                    width:"0",
                }
            });
        }
    }

    // noinspection JSMethodCanBeStatic
    getRouterOptions(accountType) {
        switch (accountType) {
            case "Admin":
                return (
                    <div>
                        <Route exact path={"/"} component={AdminView}/>
                        <Route path={"/add-user"} component={AddUser}/>
                        <Route path={"/logout"} component={Logout}/>
                    </div>
                );
            case "Clinician":
                return (
                    <div>
                        <Switch>
                            <Route exact path={"/"} component={ClinicianView}/>
                            <Route path={"/faq"} component={FAQView}/>
                            <Route path={"/answer"} component={AnswerView}/>
                            <Route path={"/about"} component={AboutView}/>
                            <Route path={"/logout"} component={Logout}/>
                            <Route component={PageNotFound} />
                        </Switch>
                    </div>
                );
            case "Patient":
                return (
                    <div>
                        <Switch>
                            <Route exact path={"/"} component={ActionView}/>
                            <Route path={"/profile"} component={ProfileView}/>
                            <Route path={"/providers"} component={ProviderView}/>
                            <Route path={"/faq"} component={FAQView}/>
                            <Route path={"/about"} component={AboutView}/>
                            <Route path={"/logout"} component={Logout}/>
                            <Route component={PageNotFound} />
                        </Switch>
                    </div>
                );
            default:
                // this should not happen
                return null;
        }
    }

    render() {
        const {loading, isUserLoggedIn, accountType} = this.state;
        if (loading) {
            return (
                <Loading/>
            );
        } else if (isUserLoggedIn) {
            const routerOptions = this.getRouterOptions(accountType);
            return (
                <div className={"app"} onClick={this.sidenavClose}>
                    <Sidenav className={"sidenav"}
                             toggle={this.sidenavToggle}
                             style={this.state.sidenavStyle}
                    />
                    <main>
                        <Header sidenavToggle={this.sidenavToggle}/>
                        <BrowserRouter>
                            {routerOptions}
                        </BrowserRouter>
                        <Footer class="footer"/>
                    </main>
                </div>
            );
        } else {
            return (
                <div className={"app"}>
                    <main>
                        <Header/>
                        <BrowserRouter>
                            <div>
                                <Switch>
                                    <Route exact path={"/"} component={HomeView}/>
                                    <Route path={"/login"} component={Login}/>
                                    <Route path={"/register"} component={Register}/>
                                    <Route path={"/about"} component={AboutView}/>
                                    <Route path={"/faq"} component={FAQView}/>
                                    <Route component={PageNotFound}/>
                                </Switch>
                            </div>
                        </BrowserRouter>
                        <Footer class="footer"/>
                    </main>
                </div>
            );
        }
    }
}

export default App;
