/** @format */

import {base64ToHex, DecodeOptions, hex2bin, PeriodUnit, RecordUnit, SensorStatus} from './tools';
import {
  HistoricalUplinkMessageType,
  UplinkMessageType,
  UplinkMessageTypeMap,
  UplinkProductType,
  UplinkProductTypeMap,
} from './uplink-command';

type BaseUplink = {
  productType: UplinkProductType;
  messageType: UplinkMessageType;
};

export type HistoricalRecord = number | {value: number; error: string};

export type HistoricalData = BaseUplink & {
  numberOfRecords: number;
  periodBetweenRecords: {value: number; unit: PeriodUnit};
  redundancyOfRecord: number;
  unit: RecordUnit;
  records: HistoricalRecord[];
};

export type PeriodicRecord = {
  status: SensorStatus;
  value: number;
  unit?: RecordUnit;
};

export type IziairValue = 'good' | 'average' | 'warning' | 'error' | 'reserved';
const iziairValueMap: IziairValue[] = [
  'good',
  'reserved',
  'average',
  'reserved',
  'warning',
  'reserved',
  'reserved',
  'error',
];

export type IziairSource = 'none' | 'co2' | 'voc' | 'error' | 'reserved';
const iziairSourceMap: IziairSource[] = [
  'none',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'co2',
  'voc',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'error',
];

export type PowerSource = 'battery' | 'external-5v' | 'reserved';
const powerSourceMap: PowerSource[] = ['battery', 'external-5v', 'reserved', 'reserved'];

export type BatteryLevel = 'high' | 'average' | 'low' | 'critical' | 'external-power-source' | 'reserved';
const batteryLevelMap: BatteryLevel[] = [
  'high',
  'average',
  'low',
  'critical',
  'external-power-source',
  'reserved',
  'reserved',
];

export type SensorStatusInfo = 'ok' | 'defect' | 'not-present' | 'disabled' | 'at-end-of-life';
const sensorStatusInfoMap: SensorStatusInfo[] = ['ok', 'defect', 'not-present', 'disabled', 'at-end-of-life'];

export type SDStatus = 'ok' | 'unable-to-mount-drive' | 'not-present' | 'disabled' | 'at-end-of-life';
const sDStatusMap: SDStatus[] = ['ok', 'unable-to-mount-drive', 'not-present', 'disabled', 'at-end-of-life'];

export type AntiTearSensorStatus =
  | 'dock-not-detected'
  | 'dock-detected'
  | 'sensor-removed-from-dock-just-now'
  | 'sensor-installed-on-dock-just-now';
const antiTearSensorStatusMap: AntiTearSensorStatus[] = [
  'dock-not-detected',
  'dock-detected',
  'sensor-removed-from-dock-just-now',
  'sensor-installed-on-dock-just-now',
];

export type ConfigurationSource = 'nfc' | 'application' | 'startup' | 'network' | 'gps' | 'local' | 'reserved';
const configurationSourceMap: ConfigurationSource[] = [
  'nfc',
  'application',
  'startup',
  'network',
  'gps',
  'local',
  'reserved',
  'reserved',
  'reserved',
];

export type ConfigurationState = 'succes' | 'partial-success' | 'failure' | 'reserved';
const configurationStateMap: ConfigurationState[] = ['succes', 'partial-success', 'failure', 'reserved'];

export type Lora =
  | 'LR-EU868'
  | 'LR-US915'
  | 'LR-AS923'
  | 'LR-AU915'
  | 'LR-KR920'
  | 'LR-IN865'
  | 'LR-RU864'
  | 'SF-RC1'
  | 'SF-RC6'
  | 'SF-RC7'
  | 'reserved';
const loraMap: Lora[] = [
  'LR-EU868',
  'LR-US915',
  'LR-AS923',
  'LR-AU915',
  'LR-KR920',
  'LR-IN865',
  'LR-RU864',
  'SF-RC1',
  'reserved',
  'reserved',
  'reserved',
  'reserved',
  'SF-RC6',
  'SF-RC7',
  'reserved',
];

export type PeriodicData = BaseUplink & {
  temperature: PeriodicRecord;
  humidity: PeriodicRecord;
  co2: PeriodicRecord;
  covt: PeriodicRecord;
  luminosity: PeriodicRecord;
  buttonPressed: boolean;
  averageNoise: PeriodicRecord;
  pickNoise: PeriodicRecord;
  occupancyRate: PeriodicRecord;
  iziairGlobal: IziairValue;
  iziairSource: IziairSource;
  iziairCo2: IziairValue;
  iziairCov: IziairValue;
};

export type ProductStatus = BaseUplink & {
  hardwareVersion: number;
  softwareVersion: number;
  powerSource: PowerSource;
  batteryVoltage: number | 'external-power-source' | 'error';
  batteryLevel: BatteryLevel;
  hardwareStatus: 'ok' | 'hardware-defect';
  temperatureSensorStatus: SensorStatusInfo;
  co2SensorStatus: SensorStatusInfo;
  covtSensorStatus: SensorStatusInfo;
  pirSensorStatus: SensorStatusInfo;
  microphoneSensorStatus: SensorStatusInfo;
  luminositySensorStatus: SensorStatusInfo;
  sdStatus: SDStatus;
  activationTime: number | 'error';
  timeSinceCalibration: number | 'error';
  antiTearSensorStatus: AntiTearSensorStatus;
};

export type ProductConfiguration = BaseUplink & {
  configurationSource: ConfigurationSource;
  configurationState: ConfigurationState;
  measurementPeriod: number;
  co2SensorActivation: boolean;
  covSensorActivation: boolean;
  pirSensorActivation: boolean;
  microphoneSensorActivation: boolean;
  localStorageActivation: boolean;
  automaticCalibrationActivation: boolean;
  mediumCO2Threshold: number;
  highCO2Threshold: number;
  ledActivation: boolean;
  orangeLEDActivation: boolean;
  buzzerActivation: boolean;
  buzzerConfirmationActivation: boolean;
  ledSourceActivation: 'co2' | 'iziair' | 'reserved';
  buttonNotificationActivation: boolean;
  lora: Lora;
  periodicalDataActivation: boolean;
  dataTransmissionPeriod: number;
  deltaCO2: number | 'disabled';
  deltaTemperature: number | 'disabled';
  historicalCO2DataActivation: boolean;
  historicalTemperatureDataActivation: boolean;
  nbDatalogRecords: number;
  nbDatalogTransmission: number;
  historicalMeasurementTransmissionPeriod: number | 'error';
  networkJoinStatus: 'no-join-request' | 'programmed-join-request';
  nfcStatus: 'discoverable' | 'not-discoverable';
  date: string;
};

export type DecodeUplink = HistoricalData | PeriodicData | ProductStatus | ProductConfiguration;

function getValue(payload: string, offset: number, bitSize: number): number {
  return parseInt(payload.substring(offset, offset + bitSize), 2);
}

function getDecodePayload(data: string, {encoding}: DecodeOptions): string {
  switch (encoding) {
    case 'hex':
      return hex2bin(data);
    case 'base64':
      return hex2bin(base64ToHex(data));
  }
}

function getPeriodicRecord(
  value: number,
  statusOffset: number,
  unit: RecordUnit,
  transform?: (value: number) => number
): PeriodicRecord {
  const status: SensorStatus =
    value >= statusOffset + 2
      ? 'error'
      : value >= statusOffset + 1
      ? 'not-present'
      : value >= statusOffset
      ? 'disabled'
      : 'enabled';
  const record: PeriodicRecord = {status, value};
  if (status === 'enabled') {
    if (transform) record.value = transform(value);
    if (unit) record.unit = unit;
  }
  return record;
}

function decodeHistoricalData(
  productType: UplinkProductType,
  messageType: HistoricalUplinkMessageType,
  payload: string
): HistoricalData {
  const unit =
    messageType === 'co2-historical-data'
      ? RecordUnit.CO2
      : messageType === 'temperature-historical-data'
      ? RecordUnit.TEMPERATURE
      : RecordUnit.HUMIDITY;
  const data: HistoricalData = {
    productType,
    messageType,
    numberOfRecords: getValue(payload, 16, 6),
    periodBetweenRecords: {value: getValue(payload, 22, 8) * 10, unit: PeriodUnit.MINUTE},
    redundancyOfRecord: getValue(payload, 30, 6),
    unit,
    records: [],
  };
  for (let index = 0; index < data.numberOfRecords; ++index) {
    const value = getValue(payload, 36 + index * 10, 10);
    if (value === 1023) {
      data.records.push({error: `invalid record`, value});
      continue;
    }
    data.records.push(
      messageType === 'co2-historical-data'
        ? value * 5
        : messageType === 'temperature-historical-data'
        ? parseFloat((value / 10 - 30).toFixed(2))
        : parseFloat((value / 10).toFixed(2))
    );
  }
  return data;
}

function decodePeriodicData(
  productType: UplinkProductType,
  messageType: 'periodic-data',
  payload: string
): PeriodicData {
  const data: PeriodicData = {
    productType,
    messageType,
    temperature: getPeriodicRecord(getValue(payload, 16, 10), 1021, RecordUnit.TEMPERATURE, value => value / 10 - 30),
    humidity: getPeriodicRecord(getValue(payload, 26, 10), 1021, RecordUnit.HUMIDITY, value => value / 10),
    co2: getPeriodicRecord(getValue(payload, 36, 14), 16381, RecordUnit.CO2),
    covt: getPeriodicRecord(getValue(payload, 50, 14), 16381, RecordUnit.COVT),
    luminosity: getPeriodicRecord(getValue(payload, 64, 10), 1021, RecordUnit.LUMINOSITY, value => value * 5),
    buttonPressed: getValue(payload, 74, 1) === 1,
    averageNoise: getPeriodicRecord(getValue(payload, 75, 7), 125, RecordUnit.NOISE),
    pickNoise: getPeriodicRecord(getValue(payload, 82, 7), 125, RecordUnit.NOISE),
    occupancyRate: getPeriodicRecord(getValue(payload, 89, 7), 125, RecordUnit.PERCENTAGE),
    iziairGlobal: iziairValueMap[getValue(payload, 96, 3)],
    iziairSource: iziairSourceMap[getValue(payload, 99, 4)],
    iziairCo2: iziairValueMap[getValue(payload, 103, 3)],
    iziairCov: iziairValueMap[getValue(payload, 106, 3)],
  };
  return data;
}

function decodeProductStatus(
  productType: UplinkProductType,
  messageType: 'product-status',
  payload: string
): ProductStatus {
  const batteryVoltageValue = getValue(payload, 34, 10);
  const activationTimeValue = getValue(payload, 69, 10);
  const timeSinceCalibrationValue = getValue(payload, 79, 8);

  const data: ProductStatus = {
    productType,
    messageType,
    hardwareVersion: getValue(payload, 16, 8),
    softwareVersion: getValue(payload, 16, 8),
    powerSource: powerSourceMap[getValue(payload, 32, 2)],
    batteryVoltage:
      batteryVoltageValue === 1022
        ? 'external-power-source'
        : batteryVoltageValue === 1023
        ? 'error'
        : batteryVoltageValue * 5,
    batteryLevel: batteryLevelMap[getValue(payload, 44, 3)],
    hardwareStatus: getValue(payload, 47, 1) === 0 ? 'ok' : 'hardware-defect',
    temperatureSensorStatus: sensorStatusInfoMap[getValue(payload, 48, 3)],
    co2SensorStatus: sensorStatusInfoMap[getValue(payload, 51, 3)],
    covtSensorStatus: sensorStatusInfoMap[getValue(payload, 54, 3)],
    pirSensorStatus: sensorStatusInfoMap[getValue(payload, 57, 3)],
    microphoneSensorStatus: sensorStatusInfoMap[getValue(payload, 60, 3)],
    luminositySensorStatus: sensorStatusInfoMap[getValue(payload, 63, 3)],
    sdStatus: sDStatusMap[getValue(payload, 66, 3)],
    activationTime: activationTimeValue === 1023 ? 'error' : activationTimeValue,
    timeSinceCalibration: timeSinceCalibrationValue === 255 ? 'error' : timeSinceCalibrationValue,
    antiTearSensorStatus: antiTearSensorStatusMap[getValue(payload, 96, 2)],
  };
  return data;
}

function decodeProductConfiguration(
  productType: UplinkProductType,
  messageType: 'product-configuration',
  payload: string
): ProductConfiguration {
  const ledSourceActivationValue = getValue(payload, 56, 2);
  const deltaCO2Value = getValue(payload, 70, 8);
  const deltaTemperatureValue = getValue(payload, 78, 7);
  const historicalMeasurementTransmissionPeriodValue = getValue(payload, 98, 8);
  const date = [
    `20${getValue(payload, 108, 6).toString().padStart(2, '0')}-`,
    `${getValue(payload, 114, 4).toString().padStart(2, '0')}-`,
    `${getValue(payload, 118, 5).toString().padStart(2, '0')} `,
    `${getValue(payload, 123, 5).toString().padStart(2, '0')}:`,
    `${getValue(payload, 128, 6).toString().padStart(2, '0')}`,
  ].join('');
  const data: ProductConfiguration = {
    productType,
    messageType,
    configurationSource: configurationSourceMap[getValue(payload, 16, 3)],
    configurationState: configurationStateMap[getValue(payload, 19, 2)],
    measurementPeriod: getValue(payload, 21, 5),
    co2SensorActivation: getValue(payload, 26, 1) === 1,
    covSensorActivation: getValue(payload, 27, 1) === 1,
    pirSensorActivation: getValue(payload, 28, 1) === 1,
    microphoneSensorActivation: getValue(payload, 29, 1) === 1,
    localStorageActivation: getValue(payload, 30, 1) === 1,
    automaticCalibrationActivation: getValue(payload, 31, 1) === 1,
    mediumCO2Threshold: getValue(payload, 32, 10),
    highCO2Threshold: getValue(payload, 42, 10),
    ledActivation: getValue(payload, 52, 1) === 1,
    orangeLEDActivation: getValue(payload, 53, 1) === 1,
    buzzerActivation: getValue(payload, 54, 1) === 1,
    buzzerConfirmationActivation: getValue(payload, 55, 1) === 1,
    ledSourceActivation:
      ledSourceActivationValue === 0 ? 'co2' : ledSourceActivationValue === 1 ? 'iziair' : 'reserved',
    buttonNotificationActivation: getValue(payload, 58, 1) === 1,
    lora: loraMap[getValue(payload, 59, 4)],
    periodicalDataActivation: getValue(payload, 63, 1) === 1,
    dataTransmissionPeriod: getValue(payload, 64, 6),
    deltaCO2: deltaCO2Value === 255 ? 'disabled' : deltaCO2Value * 4,
    deltaTemperature: deltaTemperatureValue === 127 ? 'disabled' : deltaTemperatureValue / 10,
    historicalCO2DataActivation: getValue(payload, 85, 1) === 1,
    historicalTemperatureDataActivation: getValue(payload, 86, 1) === 1,
    nbDatalogRecords: getValue(payload, 87, 6),
    nbDatalogTransmission: getValue(payload, 93, 5),
    historicalMeasurementTransmissionPeriod:
      historicalMeasurementTransmissionPeriodValue === 255 ? 'error' : historicalMeasurementTransmissionPeriodValue,
    networkJoinStatus: getValue(payload, 106, 1) === 0 ? 'no-join-request' : 'programmed-join-request',
    nfcStatus: getValue(payload, 107, 1) === 0 ? 'discoverable' : 'not-discoverable',
    date,
  };
  return data;
}

export function decodeUplink(data: string, options: DecodeOptions = {encoding: 'hex'}): DecodeUplink {
  const payload = getDecodePayload(data, options);
  const productType = UplinkProductTypeMap[getValue(payload, 0, 8)];
  if (!productType) throw new Error(`invalid product type code : "${getValue(payload, 0, 8)}"`);
  const messageType = UplinkMessageTypeMap[getValue(payload, 8, 8)];
  switch (messageType) {
    case 'co2-historical-data':
    case 'temperature-historical-data':
    case 'humidity-historical-data':
      return decodeHistoricalData(productType, messageType, payload);
    case 'periodic-data':
      return decodePeriodicData(productType, messageType, payload);
    case 'product-status':
      return decodeProductStatus(productType, messageType, payload);
    case 'product-configuration':
      return decodeProductConfiguration(productType, messageType, payload);
    default:
      throw new Error(`${messageType} not implemented`);
  }
}

// temperature-historical-data
// console.log(decodeUplink('qgMYBDhuG4diCKIn', {encoding: 'base64'}));

// periodic-data
// console.log(decodeUplink('qgGGICCnv/7/v79+ADg=', {encoding: 'base64'}));

// product status
console.log(decodeUplink('qgUIGy0EASSYAfScQA==', {encoding: 'base64'}));

// product-configuration
// console.log(decodeUplink('qgYvozISwGN59FYIQMMSR0g=', {encoding: 'base64'}));
