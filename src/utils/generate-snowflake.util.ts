import * as _cluster from "cluster";
import { Injectable } from "@nestjs/common";

const cluster = _cluster as any;

@Injectable()
export class SnowflakeGenerator {
  private readonly _talkIoEpoch: number = 1672534800000;
  private static _lastSnowflake: string;
  private static _increment: number = 0;

  private _addPadding(num: number, by: number): string {
    return num.toString(2).padStart(by, "0");
  }

  private _getIncrement(add: number): string {
    return this._addPadding(SnowflakeGenerator._increment + add, 12);
  }

  public generateSnowflake(): string {
    const self = SnowflakeGenerator;
    const timeSince = this._addPadding(Date.now() - this._talkIoEpoch, 42);
    const workerID = this._addPadding(cluster?.worker?.id || 0, 5);
    const processID = this._addPadding(process.pid, 5);

    let snowflake = `0b${timeSince}${workerID}${processID}${this._getIncrement(
      0
    )}`;
    if (snowflake === self._lastSnowflake) {
      snowflake = `0b${timeSince}${workerID}${processID}${this._getIncrement(
        1
      )}`;
    }

    self._lastSnowflake = snowflake;
    self._increment = self._increment === 4095 ? 0 : self._increment + 1;

    return BigInt(snowflake).toString();
  }
}
