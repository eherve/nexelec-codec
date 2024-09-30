/** @format */

export enum PeriodUnit {
  MINUTE = 'minute',
}

export enum RecordUnit {
  TEMPERATURE = '°C',
  HUMIDITY = '%RH',
  CO2 = 'ppm',
  COVT = 'ug/m3',
  LUMINOSITY = 'lux',
  NOISE = 'db',
  PERCENTAGE = '%',
}

export type SensorStatus = 'enabled' | 'disabled' | 'not-present' | 'error';

export type PayloadEncoding = 'hex' | 'base64';

export type DecodeOptions = {
  encoding: PayloadEncoding;
};

export type EncodeOptions = {
  encoding: PayloadEncoding;
};

export function hexToBase64(source: string): string {
  return btoa(String.fromCharCode(...source.match(/.{2}/g)!.map(c => parseInt(c, 16))));
}

export function base64ToHex(source: string): string {
  return atob(source)
    .split('')
    .reduce((acc, c) => acc + `0${c.charCodeAt(0).toString(16)}`.slice(-2), '');
}

const HexBinValue: {[key: string]: string} = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  a: '1010',
  b: '1011',
  c: '1100',
  d: '1101',
  e: '1110',
  f: '1111',
};

export function hex2bin(hex: string) {
  return hex
    .replace('', '')
    .toLowerCase()
    .split('')
    .reduce((pv, cv: string) => {
      pv += HexBinValue[cv];
      return pv;
    }, '');
}
