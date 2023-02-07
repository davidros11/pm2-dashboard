import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container';

const buttonStyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px"
    //fontFamily: "Arial"
  };

class process {
    pid = 0
    name = 'p1'
    status = 'active'

}

function makeButton(pm2Data: process, onClickFunc: Function) {
    return (
        <button  onClick={() => onClickFunc(pm2Data)}>
            {pm2Data.name} {pm2Data.pid} {pm2Data.status}
        </button>
    );
}


class Panel extends React.Component<{}, {current: number, processes: process[]}> {
    constructor(props: Readonly<{}>) {
        super(props)
        this.state = { current: 0, processes: [new process(), new process()]}
    }

    onclick(pm2data: any) {
        return
    }

    render() {
        let p = this.state['processes']
        let current_info = null;
        let style = { width: '50px'}
        if (p.length != 0) {
            current_info = this.state.processes[this.state.current]
        }
        return (
            <div>
                <div>
                    <h1>greetings</h1>

                    {this.state['processes'].map((a) => makeButton(a, this.onclick))}
                </div>
                <div>

                </div>
            </div>
        )
    } // {info(current_info)}
};

{/* <Container>
<Row>
    <Col>aaaaaaaaaaaaaaaa</Col>
    <Col>aaaaaaaaaaaa</Col>
    <Col>aaaaaaaaaaaaaaaa</Col>
    <Col>aaaaaaaaaaaa</Col>
    <Col>aaaaaaaaaaaaaaaa</Col>
    <Col>aaaaaaaaaaaa</Col>
</Row>
</Container> */}


export default Panel;
