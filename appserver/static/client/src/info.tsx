import React from "react"
//import Collapsible from "react-collapsible"
import process from './process'
import Clock from './clock'
import utils from './utils'

import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup
  } from "../node_modules/react-bootstrap/esm/index"

const Box = (props: {upper: any, lower: any, style?: any}) => {
    const style = {textAlign: 'center', borderRadius: '5px', ...props.style}
    return (<div style={style}>
            {props.upper} <hr/> {props.lower}
    </div>)
}

const Monit = (props: {title: any, current: string, avg: string, min: string, max: string}) => {
    const current_mem = <Box upper='current' lower={props.current}/>
    const avg_mem = <Box upper='avg' lower={props.avg}/>
    const min_mem = <Box upper='min' lower={props.min}/>
    const max_mem = <Box upper='max' lower={props.max}/>
    const composite = (
        <Container>
            <Row style={{marginBottom: '5px', borderBottom: '2px solid lightblue', paddingBottom: '10px'}}>
                <Col>
                    {current_mem}
                </Col>
                <Col>
                    {avg_mem}
                </Col>
            </Row>
            <Row style={{marginBottom: '5px'}}>
                <Col>
                    {min_mem}
                </Col>
                <Col>
                    {max_mem}
                </Col>
            </Row>
        </Container>
        )
    return <Box upper={props.title} lower={composite} style={{border: '2px solid lightblue', borderRadius: '5px'}}/>
}

function Info(props: {process: process | null, onclick: Function} | null) {
    if (props?.process == null) {
        return null
    }
    let process = props.process
    const border =  {border: '2px solid lightblue', borderRadius: '5px'}
    //let statusText = icons[process.status as keyof typeof icons]
    const clock = <Clock initSeconds={process.pm2_env.pm_uptime} style={{textAlign: 'center', fontSize: 30}} disable={process.pm2_env.status !== 'online'}/>
    const st = <h1 style={{textAlign: 'center', color: process.pm2_env.status_color, fontSize: 30 }}>{process.pm2_env.status}</h1>
    const bStyle = {marginRight: '5px'}
    const startOrRestart = process.pm2_env.status === 'online' ? 'Restart': 'Start'
    const info = (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center'}}>{process.name}</h1>
                <hr/>
            </Row>
            <Row>
                <ButtonGroup style={{width: '100%', marginBottom: '10px'}}>
                    <Button style={bStyle} onClick={() => props.onclick(process.pm_id, startOrRestart)}>{startOrRestart}</Button>
                    <Button style={bStyle} onClick={() => props.onclick(process.pm_id, 'Stop')}>Stop</Button>
                    <Button style={bStyle} onClick={() => props.onclick(process.pm_id, 'Delete')}>Delete</Button>
                </ButtonGroup>
                <hr/>
            </Row>
            <Row>
                <Col></Col>
                <Col>
                    <Box upper={st} lower={clock}/>
                </Col>
                <Col></Col>
            </Row>
            <Row style={{fontSize: 15, marginBottom: '20px'}}>
                <Col><Box upper="PID" lower={process.pid} style={border}/></Col>
                <Col><Box upper="Restarts" lower={process.pm2_env.restart_time} style={border}/></Col>
                <Col><Box upper="Unstable Restarts" lower={process.pm2_env.unstable_restarts} style={border}/></Col>
            </Row>
            <Row style={{fontSize: 15, marginBottom: '20px'}}>
                <Col>
                    <Monit title={<h4>CPU</h4>}
                        current={process.monit.cpu.toString() + '%'}
                        avg={process.monit.cpu_avg.toString() + '%'}
                        min={process.monit.cpu_min.toString() + '%'}
                        max={process.monit.cpu_max.toString() + '%'}
                        />
                </Col>
                <Col>
                    <Monit title={<h4>Memory</h4>}
                        current={utils.memoryFormat(process.monit.memory)}
                        avg={utils.memoryFormat(process.monit.memory_avg)}
                        min={utils.memoryFormat(process.monit.memory_min)}
                        max={utils.memoryFormat(process.monit.memory_max)}
                        />
                </Col>
            </Row>
        </Container>)
    const logStyle = {backgroundColor: 'black', color: 'white', borderRadius: '5px', height: '100%', width: '100%', marginTop: '12px'}
    const logs = (
        <Container style={{height: '100%'}}>
            <Row style={{height: '100%'}}>
                <div style={logStyle}><p style={{marginTop: '5px', color: 'white'}}>{process.pm2_env.logs}</p></div>
            </Row>
        </Container>
    )
    return <Container style={{border: '2px solid lightblue', borderRadius:'5px', height: '100%'}}>
        <Row style={{height: '98%'}}><Col xs={6}>{info}</Col><Col style={{marginRight: '0px'}}>{logs}</Col></Row>
        </Container>
}

export default Info