import React from "react"
import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup
  } from "../node_modules/react-bootstrap/esm/index"
import Process from './process'
import Clock from './clock'
import utils from './utils'
import LogDisplay from './logDisplay'

  /**
   * React Component of two elements arranged vertically and separated by a line
   * @param props upper - upper element lower - lower element
   */
const Box = (props: {upper: any, lower: any, style?: any}) => {
    const style = {textAlign: 'center', borderRadius: '5px', ...props.style}
    return (<div style={style}>
            {props.upper} <hr/> {props.lower}
    </div>)
}

/**
 * JSX Element that represents a certain statistic
 * @param props {
 *      title: Name of the statistic
 *      currrent, avg, min, max: represents the statistic in their current, average, minimal and maximal values
 * }
 */
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

function Info(props: {process: Process | null, onclick: Function} | null) {
    if (props?.process == null) {
        return null
    }
    let process = props.process
    const border =  {border: '2px solid lightblue', borderRadius: '5px'}
    const clock = <Clock initSeconds={process.pm2_env.duration} style={{textAlign: 'center', fontSize: 30}}/>
    const st = <h1 style={{textAlign: 'center', color: process.pm2_env.status_color, fontSize: 30 }}>{process.pm2_env.status}</h1>
    const bStyle = {marginRight: '5px'}
    const info = (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center'}}>{process.name}</h1>
                <hr/>
            </Row>
            <Row>
                <ButtonGroup style={{width: '100%', marginBottom: '10px'}}>
                    <Button style={bStyle} onClick={() => props.onclick(process.pm_id, 'Restart')}>Restart</Button>
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
                        current={process.monit.cpu.toFixed(2).toString() + '%'}
                        avg={process.monit.cpu_avg.toFixed(2).toString() + '%'}
                        min={process.monit.cpu_min.toFixed(2).toString() + '%'}
                        max={process.monit.cpu_max.toFixed(2).toString() + '%'}
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
    return <Container style={{border: '2px solid lightblue', borderRadius:'5px', height: '100%'}}>
            <Row style={{height: '98%'}}>
                <Col xs={6}>{info}</Col><Col style={{marginRight: '0px'}}>
                    <LogDisplay log={process.pm2_env.logs} id={process.pm_id}/>
                </Col>
            </Row>
        </Container>
}

export default Info