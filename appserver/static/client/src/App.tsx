import React from "react";
import Panel from './panel'
import Connecter from "./connecter";

class App extends React.Component {
    render() {
        let connecter = new Connecter()
        connecter.begin()
        return <div style={{ marginTop:'10px' }}><Panel connecter={connecter}/></div>;
    }
};



export default App;
