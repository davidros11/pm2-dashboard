class Pm2Env {
    pm_uptime =  0
    status = 'online'
    restart_time = 0
    unstable_restarts = 0
    logs: Promise<string> | string = ''
    get duration() {
        return Math.round((Date.now() - this.pm_uptime) / 1000)
    }
    get status_color() {
        switch(this.status) {
            case 'online': return 'green';
            case 'launching': return 'yellow';
            case 'stopping': return 'orange';
            case 'stopped': return 'red';
            case 'errored': return 'purple';
            default: return 'black'
        }
    }
}

class Process {
    pm_id = 0
    pid = 0
    name = ''
    monit = {
        memory: 0,
        memory_avg: 0,
        memory_min: 0,
        memory_max: 0,
        memory_num: 0,
        cpu: 0,
        cpu_avg: 0,
        cpu_min: 0,
        cpu_max: 0,
        cpu_num: 0,
    }
    pm2_env = new Pm2Env() 
}

export default Process