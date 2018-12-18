import React from 'react';
import numeral from 'numeral';

const numbersRegex = /[0-9]+/g;
const numeralFormat = '0,0.00';

const getFormattedNumeralValue = text => {
  if (text) {
    const valueInNumberFormat = Number(text);
    const valueInFormatted = numeral(valueInNumberFormat).format(numeralFormat);
    return valueInFormatted.trim();
  } else {
    const noValue = numeral('0.00').format(numeralFormat);
    return noValue;
  }
};

const getUnformattedNumeralValue = text => numeral(text).value();

const getCursorPosition = node => {
  if (node && node.selectionStart && node.selectionEnd) {
    if (node.selectionStart === node.selectionEnd) {
      return node.selectionStart;
    } else {
      // handle cases for selections
    }
  }
};

const setCursorPosition = (node, atPosition) => {
  if (node && node.setSelectionRange) {
    node.setSelectionRange(atPosition, atPosition);
  }
};

class ReactNumbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: getFormattedNumeralValue(this.props.value),
      cursorPosition: 1
    };
    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { current: node = '' } = this.inputRef;
    const { cursorPosition } = this.state;
    if (prevState.inputValue !== this.state.inputValue) {
      setCursorPosition(node, cursorPosition);
    }
  }

  onCommaDotPress(event) {
    const { key = '', code = '' } = event;
    if (key || code) {
      if (key === ',' || key === '.' || code === 'Comma' || code === 'Period') {
        const { current: node = '' } = this.inputRef;
        // Todo
        event.preventDefault();
      }
    }
  }

  onChangeHandler(event) {
    const { current: node = '' } = this.inputRef;
    const { target: { value: rawInputValue = '' } = {} } = event;
    const currentCursorPosition = getCursorPosition(node);
    const unformattedInputValue = getUnformattedNumeralValue(rawInputValue);
    const formattedInputValue = getFormattedNumeralValue(unformattedInputValue);

    let newCursorPosition = 0;
    if (String(unformattedInputValue).length === String(formattedInputValue).length) {
      newCursorPosition = currentCursorPosition;
    } else {
      newCursorPosition = currentCursorPosition;
    }
    event.preventDefault();
    this.setState(
      {
        inputValue: formattedInputValue,
        cursorPosition: newCursorPosition
      },
      () => this.props.onChange(unformattedInputValue)
    );
  }

  render() {
    const { type, onKeyUp,onChange,value, ...rest } = this.props;
    return (
      <input
        {...rest}
        type="tel"
        value={this.state.inputValue}
        onChange={e => this.onChangeHandler(e)}
        onKeyUp={e => this.onCommaDotPress(e)}
        ref={this.inputRef}
      />
    );
  }
}

export default ReactNumbers;
