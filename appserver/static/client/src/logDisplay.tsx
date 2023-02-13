import React from 'react'
import {
    Container,
    Row
  } from "../node_modules/react-bootstrap/esm/index"

class LogDisplay extends React.Component<{log: Promise<string> | string, id: number}, {log: string}> {
    constructor(props: {log: Promise<string> | string, id: number}) {
        super(props)
        this.state = { log: 'loading...'}
    }
    
    update() {
        if ( typeof this.props.log === 'string') {
            this.setState({log: this.props.log})
            return
        }
        this.props.log.then((value: string) => {
                this.setState({log: value})
                console.log(value)
            },
            (reason: any) => console.log(reason) )
    }

    componentDidMount() {
        this.update()
    }

    componentDidUpdate(prevProps: {log: Promise<string>, id: number}) {
        if(this.props.id !== prevProps.id) {
            this.setState({log: 'loading...'})
        }
        if (this.props.log !== prevProps.log) {
            this.update()
        }
    }
    render() {
        const logStyle = {backgroundColor: 'black', color: 'white', borderRadius: '5px', height: '100%', width: '100%', maxHeight: '750px', overflow: 'scroll'}
        return (<Container style={{height: '100%'}}>
            <Row style={{height: '100%'}}>
                <div style={logStyle}><p style={{marginTop: '5px', color: 'white'}}>{this.state.log}</p></div>
            </Row>
        </Container>)
    }
}

export default LogDisplay