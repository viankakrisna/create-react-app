import React, { Component } from 'react';
import logo from '~/logo.svg';
import s from '~/App.css';

// decorators
function addProps(props) {
  return Component => class AddedProps extends React.Component {
    render() {
      return <Component {...props} />;
    }
  };
}

@addProps({ name: 'Foo Bar' })
class App extends Component {
  state = {
    counter: 0,
  };
  increment = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  decrement = () => {
    this.setState({
      counter: this.state.counter - 1,
    });
  };
  render() {
    return (
      <div className={s.app}>
        <div className={s.header}>
          <img src={logo} className={s.logo} alt="logo" />
          <h2>Welcome to React, {this.props.name}</h2>
        </div>
        <p className={s.intro}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>{this.state.counter}</h1>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}

export default App;
