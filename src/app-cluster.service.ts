import * as os from "os";
import * as _cluster from "cluster";
import {Injectable} from "@nestjs/common";

const cpuCount = 1 || os.cpus().length;
const cluster = _cluster as any;

@Injectable()
export class AppClusterService {
    static clusterize(callback: Function): void {
        if (cluster.isMaster) {
            console.log(`Master server started on \`${process.pid}\`!`);
            for (let i = 0; i < cpuCount; i++) cluster.fork();

            cluster.on("exit", (worker, code, signal) => {
                console.log(`Slave \`${worker.process.pid}\` died!`);
                cluster.fork();
            });
        } else {
            console.log(`Slave process started on \`${process.pid}\``);
            return callback();
        }
    }
}