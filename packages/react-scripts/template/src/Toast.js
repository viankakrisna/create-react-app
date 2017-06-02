import React from 'react';
import styles from './Toast.css';

export default class Toast extends React.Component {
  state = {
    active: true,
  };

  close = () => {
    clearTimeout(this.timeout);
    this.setState({
      active: false,
    });
  };
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({
        active: false,
      });
    }, this.props.timeout);
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    return (
      <div
        className={[
          styles.Toast,
          this.state.active ? styles.active : styles.inactive,
        ].join(' ')}
      >
        <span className={styles.ToastText}>
          {this.props.children}
        </span>
        <button className={styles.ToastButton} onClick={this.close}>
          Dismiss
        </button>
      </div>
    );
  }
}

Toast.defaultProps = {
  timeout: 3000,
};
