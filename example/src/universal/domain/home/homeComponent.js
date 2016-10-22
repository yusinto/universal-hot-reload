import React, {Component} from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.onClickGenerateRandom = ::this.onClickGenerateRandom;
  }

  onClickGenerateRandom() {
    this.props.generateRandom();
  }

  render() {
    return (
      <div>
        <p>
          Welcome to the homepage!
        </p>
        {
            <div>
              <p>
                Try changing this text in your code editor. You should see hot reload working on the client side. Then
                if you do a browser hard refresh, you'll see that server side rendering returns the updated text as well.
              </p>
              <button onClick={this.onClickGenerateRandom}>Generate random number</button>
              <p>{this.props.number}</p>
            </div>
        }
      </div>
    );
  }
}