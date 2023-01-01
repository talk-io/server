import cluster from "node:cluster";
import dayjs from "dayjs";

const talkIoEpoch = 1672534800000;
let lastSnowflake: string;
let increment = 0;

const addPadding = (num: number, by: number) => num.toString(2).padStart(by, "0");
const getIncrement = (add: number) => addPadding(increment + add, 12);

export const generateSnowflake = () => {
    const timeSince = addPadding(dayjs().millisecond() - talkIoEpoch, 42);
    const workerID = addPadding(cluster.worker.id, 5);
    const processID = addPadding(process.pid, 5);

    let snowflake = `${timeSince}${workerID}${processID}${getIncrement(0)}`;
    if(snowflake === lastSnowflake) snowflake = `${timeSince}${workerID}${processID}${getIncrement(1)}`;

    lastSnowflake = snowflake;
    increment = increment === 4095 ? 0 : increment + 1;

    return snowflake;
}