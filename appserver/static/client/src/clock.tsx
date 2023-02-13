import React from 'react';

function addZero(num: number) {
    let str = num.toString();
    return num >= 10 ? str : '0' + str
}


const Clock = (props: {initSeconds: number, style?: any}) => {
    let seconds = addZero(props.initSeconds % 60)
    let totalMinutes = Math.floor(props.initSeconds / 60)
    let minutes = addZero(totalMinutes % 60)
    let hours = addZero(Math.floor(totalMinutes / 60))
    return <p style={props.style}>{hours}:{minutes}:{seconds}</p>
}

// class Clock extends React.Component<{initSeconds: number, style?: any, disable?: boolean}, {totalSeconds: number}> {
//     interval: any = null
//     constructor(props: {initSeconds: number, style?: any, disable: boolean}) {
//         super(props)
//         this.state = {totalSeconds: props.initSeconds}
//         this.update = this.update.bind(this)
//     }

//     update() {
//         let seconds = this.state.totalSeconds + 1;
//         this.setState({totalSeconds: seconds})
//     }

//     componentDidMount() {
//         if (!this.props.disable) {
//             //this.interval = setInterval(this.update, 1000);
//         }
//       }
    
//     componentWillUnmount() {
//         clearInterval(this.interval);
//       }

//     render() {
//         let seconds = addZero(this.state.totalSeconds % 60)
//         let totalMinutes = Math.floor(this.state.totalSeconds / 60)
//         let minutes = addZero(totalMinutes % 60)
//         let hours = addZero(Math.floor(totalMinutes / 60))
//         return <p style={this.props.style}>{hours}:{minutes}:{seconds}</p>
//     }
// }

export default Clock;
