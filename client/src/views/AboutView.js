import React, { Component } from 'react';


class AboutView extends Component {
    render(){
        return(
            <div className={"defaultview"}>
                <h1>Child Development Center</h1>
                <blockquote>
                    <p>The Child Development Center was formed in 2009 as an integration of the clinical activities of <a href="/specialties/developmental-and-behavioral-pediatrics">Developmental and Behavioral Pediatrics</a>, <a href="/specialties/psychology">Intellectual and Developmental Disability (IDD) Psychology</a>, and the <a href="/specialties/center-for-autism-spectrum-disorders">Center for Autism Spectrum Disorders</a>. It&nbsp;offers a wide range of services to address the developmental and behavioral needs of children, adolescents and families struggling with autism spectrum disorders and other neurodevelopmental disabilities.<br />
                        <br />
                        We offer state-of-the-art, interdisciplinary assessment and treatment, including Intensive Behavioral Intervention (IBI), a scientifically proven treatment for children with autism. Our faculty physicians and psychologists provide support and leadership across a number of related interdisciplinary programs targeting individuals with intellectual and developmental disabilities at Nationwide Children&rsquo;s Hospital and the Nisonger Center of The Ohio State University (OSU).<br />
                        <br />
                        A variety of training programs exist, including a predoctoral practicum program, a predoctoral internship, postdoctoral fellowships in IDD psychology and  fellowship programs. There are also opportunities for exposing medical students and other post graduate trainees to this important area of pediatric care, as well as a range of collaborative training programs with the Nisonger Center. </p>
                    <p>Outreach activities include rural developmental behavioral assessment and management clinics.</p>
                    <br/>
                    <small>Nationwide Children's</small>
                </blockquote>
            </div>
        );
    }
}

export default AboutView;
