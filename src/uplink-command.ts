/** @format */

export type UplinkProductType = 'feel' | 'rise' | 'move' | 'sign';

export const UplinkProductTypeMap: {[key: number]: UplinkProductType} = {
  0xa9: 'feel',
  0xaa: 'rise',
  0xab: 'move',
  0xad: 'sign',
};

export type HistoricalUplinkMessageType =
  | 'co2-historical-data'
  | 'temperature-historical-data'
  | 'humidity-historical-data';
export type UplinkMessageType =
  | 'periodic-data'
  | 'product-status'
  | 'product-configuration'
  | HistoricalUplinkMessageType
  | 'sigfox-periodic-data'
  | 'sigfox-product-status'
  | 'sigfox-product-configuration-n1'
  | 'sigfox-product-configuration-n2';

export const UplinkMessageTypeMap: {[key: number]: UplinkMessageType} = {
  0x01: 'periodic-data',
  0x02: 'co2-historical-data',
  0x03: 'temperature-historical-data',
  0x04: 'humidity-historical-data',
  0x05: 'product-status',
  0x06: 'product-configuration',
  0x11: 'sigfox-periodic-data',
  0x15: 'sigfox-product-status',
  0x16: 'sigfox-product-configuration-n1',
  0x17: 'sigfox-product-configuration-n2',
};

// type BaseUplinkValue = {
//   id: string;
//   name: string;
//   offset: number;
//   bitSize: number;
// };

// export type CommandUplinkValue = BaseUplinkValue & {
//   valueType: 'command';
// };

// export type BooleanUplinkValue = BaseUplinkValue & {
//   valueType: 'boolean';
// };

// export type EnumUplinkValue = BaseUplinkValue & {
//   valueType: 'enum';
//   enum: string[];
// };

// export type MapUplinkValue = BaseUplinkValue & {
//   valueType: 'map';
//   map: {[base64: number]: any};
// };

// export type NumberUplinkValue = BaseUplinkValue & {
//   valueType: 'number';
//   step: number;
//   unit?: string;
// };

// export type UplinkValue =
//   | CommandUplinkValue
//   | BooleanUplinkValue
//   | EnumUplinkValue
//   | MapUplinkValue
//   | NumberUplinkValue;

// export const ProductTypeEntry: MapUplinkValue = {
//   id: 'productType',
//   name: 'Type de produit',
//   offset: 0,
//   bitSize: 8,
//   valueType: 'map',
//   map: {0xa9: 'feel', 0xaa: 'rise', 0xab: 'move', 0xad: 'sign'} as {[base64: string]: UplinkProductType},
// };

// export const MessageTypeEntry: MapUplinkValue = {
//   id: 'messageType',
//   name: 'Type de message',
//   offset: 8,
//   bitSize: 8,
//   valueType: 'map',
//   map: {
//     0x01: 'periodic-data',
//     0x02: 'co2-historical-data',
//     0x03: 'temperature-historical-data',
//     0x04: 'humidity-historical-data',
//     0x05: 'product-status',
//     0x06: 'product-configuration',
//     0x11: 'sigfox-periodic-data',
//     0x15: 'sigfox-product-status',
//     0x16: 'sigfox-product-configuration-n1',
//     0x17: 'sigfox-product-configuration-n2',
//   } as {[base64: string]: UplinkMessageType},
// };
