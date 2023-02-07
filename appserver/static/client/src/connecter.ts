import Process from './process'

function makename() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function randProc() {
    let proc = new Process();
    proc.pm_id = Math.random() * 100;
    proc.pid = Math.round(Math.random() * 1000);
    proc.name = makename()
    return [proc.pm_id, proc];
}

class Connecter {
    listeners: Set<any> = new Set<any>()

    addListener(listener: any) {
        this.listeners.add(listener)
        this.updateListeners();
    }

    removeListener(listener: any) {
        this.listeners.delete(listener)
    }

    updateListeners() {
        const processes = this.getProcesses();
        for (const listener of this.listeners) {
            listener.updateProcesses(processes);
        }
    }

    getProcesses() {
        let proc = new Map<number, Process>();
        let stuff = [randProc(), randProc(), randProc(), randProc(), randProc(), randProc(), randProc(), randProc()];
        stuff.sort((p1: any, p2: any) => p1[0] - p2[0])
        for (let i = 0; i < stuff.length; i++) {
            proc.set(stuff[i][0] as number, stuff[i][1] as Process);
        }
        const id = stuff[0][0] as number;
        proc.get(id)!.pm2_env.pm_uptime = 10
        return proc
    }
    restartProcess(id: number) {

    }
    startProcess(id: number) {
        
    }
    stopProcess(id: number) {
        
    }
    deleteProcess(id: number) {
        
    }
}

export default Connecter;