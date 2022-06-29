import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Draggable from 'react-draggable';
import Button from '@material-ui/core/Button';


const DraggableLogo = ({ onStop, logoRef, size }) => {
    return <Draggable onStop={onStop}>
        <div ref={logoRef} style={{
            width: Number(size),
            height: Number(size),
            transformOrigin: '0 0',
            backgroundSize: "contain",
            backgroundImage: "url(" + "/assets/icon.png" + ")"
        }} onClick={(e) => console.log(e)} />
    </Draggable>
};


class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.logo = React.createRef();
        this.frame = React.createRef();
        this.position = { x: 0, y: 0 };
        this.state = {
            size: 120,
            printing: false,
            myFrame: null
        };
        this.count = 0

    }

    handleClick = () => {

        /**
         * should replace old frame(add different key) ,
         * or events from frame will be blocked, and draggable element will lost control
         */
        const myFrame = <iframe
            key={new Date().getMilliseconds()}
            ref={f => {
                if (f) this.win = f.contentWindow
            }}
            onLoad={this._renderLogo}
            width={620} height={400}
            frameBorder="1" />;

        this.setState({ myFrame }, () => {
            fetch('https://s3-us-west-1.amazonaws.com/staging.hitalent.us/assets/test.html')
                .then(r => r.text())
                .then(html => {
                    this.win.document.write(html);
                    /**
                     * close document to let frame finish loading
                     */
                    addStyle(this.win.document);
                    this.win.document.close();
                })
        });

    };

    _renderLogo = (e) => {
        const document = e.target.contentWindow.document;
        const pf1 = document.getElementById('pf1');
        if (pf1) {
            const myLogo = document.createElement("div");
            myLogo.style.cssText = 'position: absolute;top:0;left:0;z-index: 1;';
            myLogo.id = 'myLogo';

            pf1.appendChild(myLogo);

            ReactDOM.render(<DraggableLogo size={this.state.size}
                                           logoRef={this.logo} />, myLogo);
        }
    };

    handlePrint = () => {
        if (this.win) {
            this.win.print();
        }
    };

    handleResize = (e) => {
        const size = e.target.value;
        this.logo.current.style.width = size + 'px';
        this.logo.current.style.height = size + 'px';
        this.setState({ size })
    };

    render() {
        return (
            <div>
                <div>
                    <Button onClick={this.handleClick}>Load</Button>
                    <Button onClick={this.handlePrint}>Print</Button>
                    <input type="number" value={this.state.size} onChange={this.handleResize} />
                </div>

                <div style={{ position: 'relative' }}>
                    {this.state.myFrame}
                    {this.state.printing && <div
                        style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            top: 0, left: 0, right: 0, bottom: 0
                        }} />
                    }
                </div>
            </div>
        )
    }
}

export default connect()(Editor)

function addStyle(document) {
    var x = document.createElement("STYLE");
    var t = document.createTextNode(`
     @media print {
        #myLogo {
            transform: scale(1.78);
            transform-origin:0 0 ;
        }
    
    }    `);
    x.appendChild(t);
    document.head.appendChild(x);
}
