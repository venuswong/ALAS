import React, { Component } from 'react';
import Button from "react-bootstrap/es/Button";
import Carousel from "react-bootstrap/es/Carousel";
import "./HomeView.css";
import About_1 from "../image/about_1.jpg";
import About_2 from "../image/about_2.png";
import About_3 from "../image/about_3.jpg";

class HomeView extends Component {
    state = {
        response: ''
    };

    render() {
        return (
            <div>
                <div className={"homeview"}>
                    <Carousel>
                        <Carousel.Item>
                            <img src={About_1} alt=""/>
                            <Carousel.Caption>
                                <h3>1 in 58 children are affected by Autism Spectrum Disorder</h3>
                                <p></p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={About_2} alt=""/>
                            <Carousel.Caption>
                                <h3>Getting treatment can be overwhelming</h3>
                                <p></p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={About_3} alt=""/>
                            <Carousel.Caption>
                                <h3>ALAS will improve the lives of children with Autism and the quality of life for the families who care for them</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                    <div className={"homeview-btn-container"}>
                        <Button type="button" className={"btn btn-primary btn-space"} href={"/login"}>Log In</Button>
                        <Button type="button" className={"btn btn-outline-secondary btn-space"} href={"/register"}>Register</Button>
                    </div>
                    <h2>{this.state.response}</h2>
                </div>
            </div>
        );
    }
}

export default HomeView;
