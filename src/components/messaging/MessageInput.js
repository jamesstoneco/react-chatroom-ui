import React, { Component } from 'react';
export default class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isTypeing: false
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    this.sendMessage();
    this.setState({message: ''});
  }

  sendMessage() {
    this.props.sendMessage(this.state.message);
    this.blur();
  }

  componentWillUnmount() {
    this.stopCheckingTyping();
  }

  sendTyping() {
    this.lastUpdateTime = Date.now();
    if(!this.state.isTyping) {
      this.setState({isTyping: true});
      this.props.sendTyping(true);
      this.startCheckingTyping();
    }
  }

  startCheckingTyping() {
    this.typingInterval = setInterval(() => {
      if(Date.now() - this.lastUpdateTime > 300) {
        this.setState({isTyping: false});
        this.stopCheckingTyping();
      }
    }, 300);
  }

  stopCheckingTyping() {
    if(this.typingInterval) {
      clearInterval(this.typingInterval);
      this.props.sendTyping(false);
    }
  }

  blur = () => {
    this.refs.messageinput.blur();
  }

  render() {
    const {message} = this.state;
    return (
      <div className="message-input">
        <form
          onSubmit={this.handleSubmit}
          className="message-form">

          <input
            id="message"
            ref={'messageinput'}
            type="text"
            className="form-control"
            value = { message }
            autoComplete={'off'}
            placeholder="Type something to send"
            onKeyUp={e => {
              e.keyCode !== 13 && this.sendTyping();
            }}
            onChange = {
              ({target: {value: v}}) => {
                this.setState({message: v});
              }
            }/>
          <button
            disabled={ message.length < 1}
            type="submit"
            className="send">Send
          </button>
        </form>
      </div>
    );
  }
}
