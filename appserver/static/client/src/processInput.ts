class ProcessInput {
    pm_id = 0
    pid = 0
    name = ''
    monit = {
        memory: 15,
        cpu: 1.0,
    }
    pm2_env = {
        status: 'online',
        restart_time: 1,
        unstable_restarts: 1,
        pm_uptime: 0
    }
   
}

export default ProcessInput