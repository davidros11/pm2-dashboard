class process {
    pm_id = 0
    pid = 1000
    name = 'p1'
    monit = {
        memory: 15,
        memory_avg: 15,
        memory_min: 15,
        memory_max: 15,
        cpu: 1.0,
        cpu_avg: 1.0,
        cpu_min: 1.0,
        cpu_max: 1.0
    }
    pm2_env = {
        startTime: Date.now() / 1000,
        status: 'online',
        restart_time: 1,
        unstable_restarts: 1,
        logs: 'hello world!\n',
        get pm_uptime() {
            return Math.round((Date.now() / 1000) - this.startTime)
        },
        set pm_uptime(value: number) {
            this.startTime = Math.round(Date.now()/1000) - value
        },
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
   
}

export default process