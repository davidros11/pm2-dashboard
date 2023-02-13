
const utils = {
    /**
     * @param bytesNum number of bytes of memory
     * @returns string representing memory with a suffix (KB, MB, GB etc)
     */
    memoryFormat(bytesNum: number) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let level = 0
        while(true) {
            if (bytesNum >= 1024) {
                level++;
                bytesNum /= 1024;
            } else {
                return bytesNum.toFixed(2).toString() + units[level]
            }
        }
    }
}

export default utils
