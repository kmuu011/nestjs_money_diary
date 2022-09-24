import {exec} from "child_process";

export const runCli = async (command) => {
    return new Promise(async (resolve, reject) => {
        exec(command, (error, stdout) => {
            if(error){
                reject(error)
            }

            resolve(stdout);
        });
    });
}