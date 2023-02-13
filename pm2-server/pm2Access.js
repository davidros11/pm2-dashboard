const pm2 = require('pm2')

class Pm2Access {

    async #connect(action) {
        return await new Promise(async (resolve, reject) => {
            pm2.connect(async (err) => {
                if(err) {
                    reject(err)
                }
                try {
                    let a = await action()
                    resolve(a)
                } catch(e) {
                    reject(e)
                }
                pm2.disconnect()
            })
        })
    }

    #getProcesses() {
        return new Promise((resolve, reject) => 
        { 
            pm2.list((err, list) => {
                if(err) {
                    reject(err)
                }
                for(let processDesc of list) {
                    const env = processDesc.pm2_env
                    processDesc.pm2_env = {
                        status: env.status,
                        pm_uptime: env.pm_uptime,
                        restart_time: env.restart_time,
                        unstable_restarts: env.unstable_restarts,
                    }
                }
                resolve(list)
        })})

    }

    #getLogFile(id) {
        return new Promise((resolve, reject) => 
        { 
            pm2.describe(id, async (err, process) => {
                if(err) {
                    reject(err)
                    return
                }
                if(process.length == 0) {
                    resolve('')
                } else {
                    resolve(process[0].pm2_env.pm_out_log_path)
                }
        })})

    }

    #restartProcess(id) {
        return new Promise((resolve, reject) => 
        { 
            pm2.restart(id, (err) => {
                if(err) {
                    reject(err)
                } 
                else {
                    resolve()
                }
        })})

    }
    
    #stopProcess(id) {
        return new Promise((resolve, reject) => 
        { 
            pm2.stop(id, (err) => {
                if(err) {
                    reject(err)
                } 
                else {
                    resolve()
                }
        })})

    }

    #deleteProcess(id) {
        return new Promise((resolve, reject) => 
        { 
            pm2.delete(id , (err) => {
                if(err) {
                    reject(err)
                } 
                else {
                    resolve()
                }
        })})

    }
    getProcesses() {
        return this.#connect(this.#getProcesses)
    }

    getLogFile(id) {
        return this.#connect(() => this.#getLogFile(id))
    }

    restartProcess(id) {
        return this.#connect(() => this.#restartProcess(id))
    }

    stopProcess(id) {
        return this.#connect(() => this.#stopProcess(id))
    }

    deleteProcess(id) {
        return this.#connect(() => this.#deleteProcess(id))
    }


}
module.exports = new Pm2Access();
