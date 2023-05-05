import React, { Component } from "react";
import './Events.css';
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

class EventsPage extends Component {

    state = {
        creating: false
    }

    startCreateEventHandler = () => {
        this.setState({
            creating: true
        });
    }

    modalConfrimHandler = () => {
        this.setState({
            creating: false
        });
    };

    modalCancelHandler = () => {
        this.setState({
            creating: false
        });
    };

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop></Backdrop>}
                {this.state.creating && <Modal title="Add Event" canCancel canConfirm onConfirm={this.modalConfrimHandler} onCancel={this.modalCancelHandler}>
                    <p>Modal Content</p>
                </Modal>}
                <div className="events-control">
                    <p>Share your events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;