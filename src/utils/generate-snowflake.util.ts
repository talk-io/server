import * as _cluster from "cluster";
import * as dayjs from "dayjs";
import { Injectable } from '@nestjs/common';

const cluster = _cluster as any;

@Injectable()
export class SnowflakeGenerator {
    private readonly talkIoEpoch: number = 1672534800000;
    private lastSnowflake: string;
    private increment: number = 0;

    private _addPadding(num: number, by: number): string {
        return num.toString(2).padStart(by, "0");
    }

    private _getIncrement(add: number): string {
        return this._addPadding(this.increment + add, 12);
    }

    public generateSnowflake(): string {
        const timeSince = this._addPadding(Date.now() - this.talkIoEpoch, 42);
        const workerID = this._addPadding(cluster?.worker?.id || 0, 5);
        const processID = this._addPadding(process.pid, 5);

        let snowflake = `0b${timeSince}${workerID}${processID}${this._getIncrement(0)}`;
        if (snowflake === this.lastSnowflake) {
            snowflake = `0b${timeSince}${workerID}${processID}${this._getIncrement(1)}`;
        }

        this.lastSnowflake = snowflake;
        this.increment = this.increment === 4095 ? 0 : this.increment + 1;

        return BigInt(snowflake).toString();
    }
}
