import React from 'react'
// Doesn't work otherwise. No idea why
import {
    Container,
    Row,
    Col,
    Button,
    Dropdown,
    DropdownButton
  } from "../node_modules/react-bootstrap/esm/index"
import Process from './process'
import utils from './utils'

  const buttonStyle = {
    color: "black",
    backgroundColor: "White",
    width: "100%",
    fontSize: 12,
    border: '4px solid lightblue',
    marginBottom: '10px',
    marginLeft: '1px',
    marginTop: '5px',
    height: '13%',
    position: 'sticky'
    //fontFamily: "Arial"
  }

let clone = Object.assign({}, buttonStyle)
clone.backgroundColor = 'lightblue'

const cButtonStyle = Object.assign({}, clone);

function icons(status: string)  {
    switch(status) {
        case 'online': return '🟢';
        case 'stopped': return '🔴';
        case 'errored': return '🟣';
        case 'stopping': return '🟠';
        case 'launching': return '🟡';
        default: return '⚫️'
    }
    
}

function statusToNum(status: string) {
    switch(status) {
        case 'online': return 5;
        case 'launching': return 4;
        case 'stopping': return 3;
        case 'stopped': return 2;
        case 'errored': return 1;
        default: return 0;
    };
}

function sortMap() {
    const funcs = {
        'default': (a: Process, b: Process) => a.pm_id - b.pm_id,
        'name': (a: Process, b: Process) => a.name.localeCompare(b.name),
        'pid': (a: Process, b: Process) => a.pid - b.pid,
        'status': (a: Process, b: Process) => statusToNum(a.pm2_env.status) - statusToNum(b.pm2_env.status),
        'uptime': (a: Process, b: Process) => a.pm2_env.pm_uptime - b.pm2_env.pm_uptime,
        'cpu': (a: Process, b: Process) => a.monit.cpu - b.monit.cpu,
        'memory': (a: Process, b: Process) => a.monit.memory - b.monit.memory,
        'restarts': (a: Process, b: Process) => a.pm2_env.restart_time- b.pm2_env.pm_uptime,
        'unstable restarts': (a: Process, b: Process) => a.pm2_env.unstable_restarts - b.pm2_env.unstable_restarts
    }
    return new Map(Object.entries(funcs));
}

function makeButton(pm2Data: Process, onClickFunc: Function, is_current: boolean, key: number) {
    return (<Row  key={key.toString()} style={is_current ? cButtonStyle : buttonStyle} onClick={() => onClickFunc(pm2Data)}>
                <Container>
                    <Row>
                        <Col>
                            <p>{pm2Data.name}</p>
                        </Col>
                        <Col>
                            <p> PID {pm2Data.pid}</p>
                        </Col>
                        <Col>
                            <p>CPU {pm2Data.monit.cpu}%</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p style={{color: pm2Data.pm2_env.status_color}}>
                                {icons(pm2Data.pm2_env.status) + ' ' + pm2Data. pm2_env.status}
                            </p>
                            
                        </Col>
                        
                        <Col>
                            Restarts {pm2Data.pm2_env.restart_time}
                        </Col>
                        <Col>
                            <p>Ram {utils.memoryFormat(pm2Data.monit.memory)}</p>
                        </Col>
                    </Row>
                </Container>    
            </Row>
    )
}

const sorterMap = sortMap();

function sortProcesses(processes: Process[], member: string, ascending: boolean) {
    let compareFn = (a: Process, b: Process) => a.pm_id - b.pm_id;
    if (sorterMap.has(member)) {
        compareFn = sorterMap.get(member)!
    }
    if (ascending) {
        processes.sort((a: Process, b: Process) => -compareFn(a, b));
    } else {
        processes.sort(compareFn);
    }
}

/**
 * This Component represents a list of processes. The list can be sorted and arranged by ascending or descending order.
 * @param props:
 *      processes: list of processes
 * 
 *      sortBy: string representing by which property processes should be sorted.
 * 
 *      ascending: true if processes should be sorted in ascending order.
 * 
 *      current: the currently picked process. Will be highlighted.
 * 
 *      onclickProcessButtons: function that is called when one of the processes is clicked.
 * 
 *      onSort: function that is called when a new parameter to sort the processes with is picked.
 */
const ProcessList = (props: {processes: Process[], sortBy: string, ascending: boolean, current: number
    onclickProcessButtons: Function, onSort: Function, flipOrder: Function}) => {

    sortProcesses(props.processes, props.sortBy,props.ascending);
    let buttons = []
    for(let process of props.processes) {
        const key = process.pm_id
        let isCurrent = (key === props.current) ? true : false
        buttons.push(makeButton(process, props.onclickProcessButtons, isCurrent, key))
    }
    let dropdowns = [];
        for(const key of sorterMap.keys()) {
            const x = <Dropdown.Item eventKey={key} key={key} active={key == props.sortBy}>{key}</Dropdown.Item>
            dropdowns.push(x)
        }
    return (<Container>
        <Row style={{marginBottom: '10px', border: '2px solid lightblue', borderRadius: '5px', backgroundColor: 'lightblue'}}>
        <Col>
            <DropdownButton title={props.sortBy} onSelect={(eventKey: any) => props.onSort(eventKey)}>
                {dropdowns}
            </DropdownButton>
        </Col>
        <Col>
            <Button style={{width: '50%', height: '100%', textAlign: 'center'}} onClick={() => props.flipOrder()}>
                {(props.ascending ? '▼' : '▲')} 
            </Button>
        </Col>
    </Row>
    <Row>
        <Container style={{borderColor: 'lightblue', width: '100%', overflow: 'scroll',
        maxHeight: '700px', border: '2px solid lightblue', borderRadius: '5px'}}>
            {buttons}
        </Container>
    </Row>
    </Container>)
}

export default ProcessList;