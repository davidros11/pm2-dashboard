import React from "react"
import {
    Container,
    Row,
    Col
  } from "../node_modules/react-bootstrap/esm/index"
import Info from './info'
import Process from "./process"
import Connecter from './connecter'
import ProcessList from "./processList"

class Panel extends React.Component<{}, {processes: Map<number, Process>, current: number, sortBy: string, ascending: boolean}> {
    connecter = new Connecter();
    
    constructor(props: Readonly<{}>) {
        super(props)
        this.state = { processes: new Map<number, Process>(), current: -1, sortBy: 'default', ascending: false}
        this.onclickProcessButtons = this.onclickProcessButtons.bind(this);
        this.onSort = this.onSort.bind(this);
        this.flipOrder = this.flipOrder.bind(this);
    }

    onclickProcessButtons(pm2data: Process) {
        this.setState({current: pm2data.pm_id})
    }

    onClickInfoButtons(id: number, action: string) {
        switch(action.toLowerCase()) {
            case 'start': this.connecter.startProcess(id);
                break;
            case 'restart': this.connecter.restartProcess(id);
                break;
            case 'stop': this.connecter.stopProcess(id);
                break;
            case 'delete': this.connecter.deleteProcess(id);
                break;
            default: break;
        }
    }

    onSort(member: string) {
        console.log(member)
        this.setState({sortBy: member})
    }

    flipOrder() {
        this.setState({ascending: !this.state.ascending})
    }

    updateProcesses(processes: Map<number, Process>) {
        const [key] = processes.keys();
        const current = (processes.has(this.state.current)) ? this.state.current : key
        this.setState({ processes: processes, current: current})
    }

    componentDidMount() {
        this.connecter.addListener(this)
    }

    componentWillUnmount() {
        this.connecter.removeListener(this)
    }

    render() {
        if (this.state.processes.size == 0) {
            return <h1 style={{textAlign: 'center'}}>Loading...</h1>
        }
        let current_info = null;
        let processes = [...this.state.processes.values()];
        if (processes.length != 0) {
            current_info = this.state.processes.get(this.state.current)!
        }
        return (
            <Container>
                <Row>
                    <Col>
                    <ProcessList processes={processes} sortBy={this.state.sortBy} ascending={this.state.ascending} current={this.state.current}
                     onclickProcessButtons={this.onclickProcessButtons} onSort={this.onSort} flipOrder={this.flipOrder} />
                    </Col>
                    <Col xs={9}>
                        <Info process={current_info} onclick={this.onClickInfoButtons}/>
                    </Col>
                </Row>
            </Container>
        )
    } // 
};


export default Panel;