import React from 'react';
import css from 'dom-css';
import clsx from 'clsx';

class ScrollContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shadowTop = React.createRef();
    this.shadowBottom = React.createRef();
  }

  handleShadow = (div) => {
    if (div && this.shadowTop.current && this.shadowBottom.current) {
      const shadowTopOpacity = (1 / 40) * Math.min(div.scrollTop, 20);
      const bottomScrollTop = div.scrollHeight - div.clientHeight;
      const shadowBottomOpacity =
        (1 / 40) *
        (bottomScrollTop - Math.max(div.scrollTop, bottomScrollTop - 20));

      css(this.shadowTop.current, { opacity: shadowTopOpacity });
      css(this.shadowBottom.current, { opacity: shadowBottomOpacity });
    }
  };

  handleScroll = (e) => {
    let div = e.target;
    this.handleShadow(div);
    const { onScroll } = this.props;
    onScroll && onScroll(e);
  };

  render() {
    const { children, classes, className } = this.props;
    return (
      <>
        <div
          className={clsx(className, classes.scrollContainer)}
          ref={(div) => this.handleShadow(div)}
          onScroll={this.handleScroll}
        >
          {children}
        </div>
        <div ref={this.shadowTop} className={classes.shadowTop} />
        <div ref={this.shadowBottom} className={classes.shadowBottom} />
      </>
    );
  }
}

export default ScrollContainer;
