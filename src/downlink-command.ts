/** @format */

export type DownlinkId =
  | '03'
  | '04'
  | '05'
  | '08'
  | '0a'
  | '10'
  | '12'
  | '13'
  | '19'
  | '1c'
  | '1d'
  | '28'
  | '29'
  | '2d'
  | '2e'
  | '2f'
  | '49'
  | '4a'
  | '4b'
  | '54'
  | '55'
  | '56'
  | '57'
  | '58'
  | '59'
  | '5a'
  | '5b'
  | '5c'
  | '5d'
  | '5e'
  | '5f';

type BaseDownlinkCommand = {
  id: DownlinkId;
  name: string;
  valueByteSize: number;
  unit?: string;
};

export type CommandDownlinkCommand = BaseDownlinkCommand & {
  valueType: 'command';
};

export type BooleanDownlinkCommand = BaseDownlinkCommand & {
  valueType: 'boolean';
};

export type EnumDownlinkCommand = BaseDownlinkCommand & {
  valueType: 'enum';
  enum: string[];
};

export type NumberDownlinkCommand = BaseDownlinkCommand & {
  valueType: 'number';
  step: number;
  range: {
    min: number;
    max: number;
  };
  unit?: string;
};

export type DownlinkCommand =
  | CommandDownlinkCommand
  | BooleanDownlinkCommand
  | EnumDownlinkCommand
  | NumberDownlinkCommand;

export const DownlinkCommands: DownlinkCommand[] = [
  {
    id: '03',
    name: 'Activation / Désactivation de l’indicateur lumineux LED CO2',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '04',
    name: 'Activation / Désactivation de l’envoi de données périodiques sur appui bouton',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '05',
    name: 'Activation / Désactivation de l’envoi de données périodiques',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '08',
    name: 'Delta température : Évolution de la température amenant à la transmission instantanée d’une mesure, pas de 0.1°C',
    valueByteSize: 1,
    valueType: 'number',
    step: 1 / 10,
    range: {min: 0, max: 99},
    unit: '°C',
  },
  {
    id: '0a',
    name: 'Activation / Désactivation de l’interface NFC',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '10',
    name: 'Delta CO2 : Évolution du CO2 amenant à la transmission instantanée d’une mesure, pas de 20ppm',
    valueByteSize: 1,
    valueType: 'number',
    step: 20,
    range: {min: 0, max: 50},
    unit: 'ppm',
  },
  {
    id: '12',
    name: 'Seuil CO2, niveau « orange » réglage du niveau CO2 par pas de 20 ppm',
    valueByteSize: 1,
    valueType: 'number',
    step: 20,
    range: {min: 0, max: 250},
    unit: 'ppm',
  },
  {
    id: '13',
    name: 'Seuil CO2, niveau « rouge »  réglage du niveau CO2 par pas de 20 ppm',
    valueByteSize: 1,
    valueType: 'number',
    step: 20,
    range: {min: 0, max: 250},
    unit: 'ppm',
  },
  {
    id: '19',
    name: 'Activation / Désactivation de la mesure de CO2',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '1c',
    name: 'Commande de connexion au réseau différée Configuration du temps avant la connexion en minutes',
    valueByteSize: 2,
    valueType: 'number',
    step: 10,
    range: {min: 0, max: 1008},
    unit: 'minute',
  },
  {
    id: '1d',
    name: 'Calibration manuelle capteur CO2 selon valeur',
    valueByteSize: 2,
    valueType: 'number',
    step: 1,
    range: {min: 0, max: 5000},
    unit: 'ppm',
  },
  {
    id: '28',
    name: 'Activation / Désactivation de l’envoi de données historisées de température',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '29',
    name: 'Activation / Désactivation de l’envoi de données historisées d’humidité',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '2d',
    name: 'Source de l’indicateur sonore et visuel',
    valueByteSize: 1,
    valueType: 'enum',
    enum: ['CO2', 'IziAir', 'Réservé 1', 'Réservé 2'],
  },
  {
    id: '2e',
    name: 'Activation / Désactivation de la notification du niveau « Orange » LED CO2',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '2f',
    name: 'Période entre deux mesures',
    valueByteSize: 1,
    valueType: 'number',
    step: 1,
    range: {min: 5, max: 30},
    unit: 'minute',
  },
  //   {
  //     id: '33',
  //     name: 'Commande réservée Nexelec',
  //     valueByteSize: 1,
  //   },
  //   {
  //     id: '46',
  //     name: 'Commande réservée Nexelec',
  //     valueByteSize: 1,
  //   },
  //   {
  //     id: '47',
  //     name: 'Commande réservée Nexelec',
  //     valueByteSize: 1,
  //   },
  //   {
  //     id: '48',
  //     name: 'Commande réservée Nexelec',
  //     valueByteSize: 1,
  //   },
  {
    id: '49',
    name: 'Période d’envoi des données périodiques',
    valueByteSize: 1,
    valueType: 'number',
    step: 1,
    range: {min: 10, max: 60},
    unit: 'minute',
  },
  {
    id: '4a',
    name: 'Commande de redémarrage du produit',
    valueByteSize: 1,
    valueType: 'command',
  },
  {
    id: '4b',
    name: 'Commande de restauration en configuration usine',
    valueByteSize: 1,
    valueType: 'command',
  },
  //   {
  //     id: '4c',
  //     name: 'Commande réservée Nexelec',
  //     valueByteSize: 1,
  //   },
  {
    id: '54',
    name: 'Activation / Désactivation du capteur de mouvement (PIR)',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '55',
    name: 'Activation / Désactivation de la mesure de luminosité',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '56',
    name: 'Activation / Désactivation de la mesure du niveau sonore (microphone)',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '57',
    name: 'Activation / Désactivation de la mesure de COV',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '58',
    name: 'Activation / Désactivation du stockage local des mesures sur carte SD',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '59',
    name: 'Activation / Désactivation de la calibration automatique de la mesure CO2',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '5a',
    name: 'Activation / Désactivation de la notification buzzer changement de niveau',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '5b',
    name: 'Activation / Désactivation de la confirmation buzzer niveau mauvais',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '5c',
    name: 'Activation / Désactivation de l’envoi de données historisées de CO2',
    valueByteSize: 1,
    valueType: 'boolean',
  },
  {
    id: '5d',
    name: 'Nombre de nouvelles mesures incluses dans un message datalog',
    valueByteSize: 1,
    valueType: 'number',
    step: 1,
    range: {min: 1, max: 36},
  },
  {
    id: '5e',
    name: 'Période de transmission des données historisées',
    valueByteSize: 1,
    valueType: 'number',
    step: 10,
    range: {min: 3, max: 144},
    unit: 'minute',
  },
  {
    id: '5f',
    name: 'Nombre de transmission d’une même mesure',
    valueByteSize: 1,
    valueType: 'number',
    step: 1,
    range: {min: 1, max: 24},
  },
];
