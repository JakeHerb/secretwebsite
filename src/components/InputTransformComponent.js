import React, { Component } from 'react';
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries';

const queueQuery = /* GraphQL */ `
    query QueueQuery {
    getQueueCount(id: "usersInQueue") {
        count,
        _version
    }
    }
`;

export default class InputTransformComponent extends Component {
    constructor(props) {
        super(props);
        this.planet = this.props.planet;
        // this.placeInLine = 
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            email: '', 
            submitted: false,
            placeInLine: 0
        }
    }
    
  usePlanet(pillColor) {
    switch (pillColor) {
      case "YELLOW":
        return "ESTALAR"
      case "ORANGE":
        return "LETHERION"
      case "PINK":
        return "DUFAITHAN"
      case "PURPLE":
        return "BLON"
      case "GREEN":
        return "VATANICA"
      default:
        return "EARTH"
    }
  }

    // Form Events
    onChange(e) {
        const queuePlace = this.state.placeInLine;
        this.setState({
            email: e.target.value,
            submitted: false,
            placeInLine: queuePlace
        });
    }

    async onSubmit(e) {
        e.preventDefault()
        console.log("WHAT HAVE YOU DONE " + this.state.email);
        const email = this.state.email
        const storedColor = localStorage.getItem('affinity')
        const affinity = this.usePlanet(storedColor)
        const queuePlaceAPI = await API.graphql({query: queueQuery});
        const fetchedVersion = queuePlaceAPI.data.getQueueCount._version;

        console.log("Done with the GET queries");
        console.log(queuePlaceAPI.data);
        console.log(queuePlaceAPI.data.getQueueCount.count);
        const nextInline = Number(queuePlaceAPI.data.getQueueCount.count + 1);


        this.setState({
            email: email,
            submitted: true,
            placeInLine: nextInline
        })
        if (this.state.email !== '') {

            // Check if the user has already entered their email
            
            console.log("BEFORE");
            const maybeContact = await API.graphql({query: queries.getUser, variables: {email: this.state.email}});
            console.log("After. Here come the contacts:");
            console.log(maybeContact.data);
            console.log("next in line: " + nextInline);
            const updateQueuePlace = await API.graphql({query: mutations.updateQueueCount, variables: {input: {id: "usersInQueue", count: nextInline, _version: fetchedVersion}}})
            console.log("Here comes the update data");
            console.log(updateQueuePlace.data);

            if (maybeContact.data.getUser !== null) {
                console.log("CANT ADD IT AGAIN!");
            } else {
                console.log("DID NOT FIND THE EMAIL");
                try {
                await API.graphql({
                    query: mutations.createUser,
                    variables: {
                        input: {
                            email, affinity, placeInQueue: nextInline
                        }
                    }
                })
                } catch (e) {
                    console.log("Error: Signals blurred")
                    console.log(e)
                }
            }
          }
    }
    // React Life Cycle
    componentDidMount() {
        this.userData = JSON.parse(localStorage.getItem('formData'));
        if (localStorage.getItem('formData').email) {
            if (localStorage.getItem('formData').placeInLine) {
                this.setState({
                    email: localStorage.getItem('formData').email,
                    submitted: false,
                    placeInLine: localStorage.getItem('formData').placeInLine
                })
            }

            this.setState({
                email: '',
                submitted: false,
                placeInLine: 0
            })
        } else {

            this.setState({
                email: '',
                submitted: false,
                placeInLine: 0
            })
        }
    }
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('formData', JSON.stringify(nextState));
    }

    render() {
        const form = (
            <>
            <p>ENTER YOUR EMAIL FOR A <br/>
            CHANCE TO MAKE THE LIST
            </p>
            <div className="email-container">
                <form onSubmit={this.onSubmit}>
                    <div className="field">
                        <input 
                            type="email"   
                            className="form-control" 
                            placeholder='YOUR EMAIL'
                            onChange={this.onChange}
                            onSubmit={this.onSubmit} 
                            value={this.state.email}
                        />
                        {this.state.email !== '' ? (<button>[SUBMIT]</button>) : null}
                    </div>
                </form>
            </div>
            </>
        )

        const submittedPage = (
              <div className="State-onsubmit">
                <div>
                  <p>YOU ARE <span style={{color: "red"}}>#{this.state.placeInLine}</span> IN LINE
                  <br />WE WILL BE IN CONTACT
                  <br />IF YOU MADE THE LIST
                  <br />NOT EVERYONE IS WORTHY
                  </p>
                </div>
                {this.props.planet}
            </div>
        )

        return (
            this.state.submitted === false ?
                form :
                submittedPage
        )
    } // End if
}
