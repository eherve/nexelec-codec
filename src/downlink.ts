/** @format */

import {min, values} from 'lodash';
import {DownlinkCommand, DownlinkCommands, DownlinkId} from './downlink-command';
import {base64ToHex} from './tools';

type BaseDecodedDownlinkValue = {
  id: string;
  name: string;
};

export type CommandDecodedDownlinkValue = BaseDecodedDownlinkValue & {
  value: 1;
};

export type BooleanDecodedDownlinkValue = BaseDecodedDownlinkValue & {
  value: boolean;
  unit?: string;
};

export type NumberDecodedDownlinkValue = BaseDecodedDownlinkValue & {
  value: number;
  unit?: string;
};

export type EnumDecodedDownlinkValue = BaseDecodedDownlinkValue & {
  value: number;
  enum: string;
};

export type DecodedDownlinkValue = BooleanDecodedDownlinkValue | NumberDecodedDownlinkValue | EnumDecodedDownlinkValue;

export type DecodedDownlink = DecodedDownlinkValue[];

function getCommand(id: string): DownlinkCommand {
  const command = DownlinkCommands.find(c => c.id === id);
  if (!command) throw new Error(`invalid command code "${id}"`);
  return command;
}

function getCommandValue(command: DownlinkCommand, rawValue: string) {
  const intValue = parseInt(rawValue, 16);
  if (isNaN(intValue)) throw new Error(`invalid command "${command.id}" value : "${rawValue}"`);
  switch (command.valueType) {
    case 'command':
      if (intValue === 1) return 1;
      throw new Error(`invalid command "${command.id}" value : "${rawValue}" is a valid command`);
    case 'boolean':
      if (intValue === 0) return false;
      if (intValue === 1) return true;
      throw new Error(`invalid command "${command.id}" value : "${rawValue}" is not a boolean`);
    case 'number':
      if (intValue < command.range.min) {
        throw new Error(
          `invalid command "${command.id}" value: "${intValue}" is less than min value ${command.range.min}`
        );
      }
      if (intValue > command.range.max) {
        throw new Error(
          `invalid command "${command.id}" value: "${intValue}" is more than max value ${command.range.max}`
        );
      }
      return intValue * command.step;
    case 'enum':
      if (intValue < 0 || intValue >= command.enum.length) {
        throw new Error(
          `invalid command "${command.id}" value: "${intValue}" does not match possible enum values ${command.enum}`
        );
      }
      return intValue;
  }
}

function buildDecodedValue(command: DownlinkCommand, value: boolean | number): DecodedDownlinkValue {
  switch (command.valueType) {
    case 'command':
      return {
        id: command.id,
        name: command.name,
        value: 1,
      } as CommandDecodedDownlinkValue;
    case 'boolean':
      return {
        id: command.id,
        name: command.name,
        value,
      } as BooleanDecodedDownlinkValue;
    case 'number':
      return {
        id: command.id,
        name: command.name,
        value,
        unit: command.unit,
      } as NumberDecodedDownlinkValue;
    case 'enum':
      return {
        id: command.id,
        name: command.name,
        value,
        enum: command.enum[value as number],
      } as EnumDecodedDownlinkValue;
  }
}

export function decodeFromHex(hex: string): DecodedDownlink {
  const payload = hex.toLowerCase();
  const code = hex.substring(0, 2);
  if (code !== '55') throw new Error(`invalid first byte "${code}"`);
  const decoded: DecodedDownlink = [];
  let index = 2;
  while (index < payload.length) {
    const command = getCommand(payload.substring(index, index + 2));
    index += 2;
    const value = getCommandValue(command, payload.substring(index, index + command.valueByteSize * 2));
    index += command.valueByteSize * 2;
    decoded.push(buildDecodedValue(command, value));
  }
  return decoded;
}

export function decodeFromBase64(base64: string): DecodedDownlink {
  return decodeFromHex(base64ToHex(base64));
}

function getHexCommandValue(command: DownlinkCommand, value: any): string {
  switch (command.valueType) {
    case 'command':
      return '01';
    case 'boolean':
      if (typeof value !== 'boolean') {
        throw new Error(`invalid command ${command.id} value: "${value}"`);
      }
      return value ? '01' : '00';
    case 'number':
      if (
        typeof value !== 'number' ||
        value / command.step < command.range.min ||
        value / command.step > command.range.max
      ) {
        throw new Error(`invalid command ${command.id} value: "${value}"`);
      }
      return Math.round(value / command.step)
        .toString(16)
        .padStart(command.valueByteSize * 2, '0')
        .substring(0, command.valueByteSize * 2);
    case 'enum':
      if (typeof value === 'number') {
        if (!command.enum[value]) throw new Error(`invalid command ${command.id} value: "${value}"`);
        return value
          .toString(16)
          .padStart(command.valueByteSize * 2, '0')
          .substring(0, command.valueByteSize * 2);
      }
      if (typeof value === 'string') {
        const index = command.enum.findIndex(v => v === value);
        if (index === -1) throw new Error(`invalid command ${command.id} value: "${value}"`);
        return index
          .toString(16)
          .padStart(command.valueByteSize * 2, '0')
          .substring(0, command.valueByteSize * 2);
      }
  }
  throw new Error(`invalid command ${command.id} value: "${value}"`);
}

export function encodeToHex(data: {id: DownlinkId; value?: any}[]): string {
  let payload = '55';
  data.forEach(d => {
    const command = getCommand(d.id);
    const value = getHexCommandValue(command, d.value);
    payload += `${command.id}${value}`;
  });
  return payload;
}
