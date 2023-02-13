import Process from './process'
import ProcessInput from './processInput';
import $ from 'jquery';

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
    proc.pm2_env.pm_uptime = Date.now() - 1000
    return [proc.pm_id, proc];
}

function setProcess(currentProcess: Process, inputProcess: ProcessInput) {
    currentProcess.pm_id = inputProcess.pm_id
    currentProcess.name = inputProcess.name
    currentProcess.pid = inputProcess.pid
    currentProcess.pm2_env.status = inputProcess.pm2_env.status;
    currentProcess.pm2_env.pm_uptime = inputProcess.pm2_env.pm_uptime;
    currentProcess.pm2_env.restart_time = inputProcess.pm2_env.restart_time;
    currentProcess.pm2_env.unstable_restarts = inputProcess.pm2_env.unstable_restarts;
    const memory = inputProcess.monit.memory
    const cpu = inputProcess.monit.cpu
    const cpuNum = currentProcess.monit.cpu_num
    const memNum = currentProcess.monit.memory_num
    currentProcess.monit.cpu = cpu
    currentProcess.monit.memory = memory
    if (currentProcess.pm2_env.status === 'online') {
        currentProcess.monit.cpu_avg = (currentProcess.monit.cpu_avg * cpuNum + cpu) / (cpuNum + 1)
        currentProcess.monit.cpu_max = Math.max(currentProcess.monit.cpu_max, cpu)
        currentProcess.monit.cpu_min =  currentProcess.monit.cpu_min === 0 ? cpu : Math.min(currentProcess.monit.cpu_min, cpu)
        currentProcess.monit.cpu_num += 1
        currentProcess.monit.memory_avg = (currentProcess.monit.memory_avg * memNum + memory) / (memNum + 1)
        currentProcess.monit.memory_max = Math.max(currentProcess.monit.memory_max, memory)
        currentProcess.monit.memory_min =  currentProcess.monit.memory_min === 0 ? memory : Math.min(currentProcess.monit.memory_min, memory)
        currentProcess.monit.memory_num += 1
    } else {
        currentProcess.monit.cpu = 0
        currentProcess.monit.memory = 0
        currentProcess.monit.cpu_avg = 0
        currentProcess.monit.cpu_max = 0
        currentProcess.monit.cpu_min =  0
        currentProcess.monit.cpu_num = 0
        currentProcess.monit.memory_avg = 0
        currentProcess.monit.memory_max = 0
        currentProcess.monit.memory_min =  0
        currentProcess.monit.memory_num = 0
    }
   
}

class Connecter {
    listeners: Set<any> = new Set<JSX.Element>()
    Processes = new Map<number, Process>()
    timer: any;
    domain = 'http://localhost:3000'

    begin() {
        this.#getProcesses()
    }

    addListener(listener: any) {
        this.listeners.add(listener)
        this.updateListeners();
    }

    removeListener(listener: any) {
        this.listeners.delete(listener)
    }

    updateListeners() {
        for (const listener of this.listeners) {
            listener.updateProcesses(this.Processes);
        }
    }

    #setProcesses(processes: ProcessInput[]) {
        let currentProcess = null;
        let newMap = new Map<number, Process>()
        for(const process of processes) {
            if(this.Processes.has(process.pm_id)) {
                currentProcess = this.Processes.get(process.pm_id!)!

            } else {
                currentProcess = new Process()
                
            }
            setProcess(currentProcess, process)
            newMap.set(currentProcess.pm_id, currentProcess);
        }
        this.Processes = newMap;
        this.updateListeners()
        
    }

    setProcessesRand() {
        let proc = new Map<number, Process>();
        let stuff = [randProc(), randProc(), randProc(), randProc(), randProc(), randProc(), randProc(), randProc()];
        stuff.sort((p1: any, p2: any) => p1[0] - p2[0])
        for (let i = 0; i < stuff.length; i++) {
            proc.set(stuff[i][0] as number, stuff[i][1] as Process);
        }
        const id = stuff[0][0] as number;
        this.Processes = proc;
        this.updateListeners()
        this.timer = setTimeout(() => this.setProcessesRand(), 1000);
    }

    #getProcesses() {
        clearTimeout(this.timer)
        $.ajax({
            method: 'GET',
            url: this.domain + '/processes',
            success: (data: any) => {
                let processes = data as ProcessInput[]
                this.#setProcesses(processes)
            },
            complete: () => {
                this.timer = setTimeout(() => this.#getProcesses(), 1000);
            }
        })
    }

    #processAction(method: string, url: string) {
        $.ajax({
            method: method,
            url: this.domain + url,
            success: () => {
                this.#getProcesses()
            }
        })
    }
    restartProcess(id: number) {
        this.#processAction('POST', '/processes/' + id.toString() + '/restart')
    }
    stopProcess(id: number) {
        this.#processAction('POST', '/processes/' + id.toString() + '/stop')
    }
    deleteProcess(id: number) {
        this.#processAction('DELETE', '/processes/' + id.toString())
    }

    getLogFile(id: number) {
        return new Promise<string>((resolve: any, reject: any) => {
            $.ajax({
                method: 'GET',
                url: this.domain + '/processes/' + id.toString() + '/logs',
                success: (data) => {
                    resolve(data as string)
                },
                error: () => {
                    resolve('Could not get log file')
                }
            })
        })
    }
}

export default Connecter