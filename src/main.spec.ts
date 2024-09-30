/** @format */

import {expect} from 'chai';

import chai = require('chai');
chai.use(require('chai-like'));
chai.use(require('chai-things'));

import {decodeDownlink, encodeDownlink} from './downlink';
import {
  BooleanDownlinkCommand,
  CommandDownlinkCommand,
  DownlinkCommand,
  DownlinkCommands,
  DownlinkId,
  EnumDownlinkCommand,
  NumberDownlinkCommand,
} from './downlink-command';
import {hexToBase64} from './tools';
import { decodeUplink } from './uplink';

function commandValidation(command: CommandDownlinkCommand) {
  describe('Décode', () => {
    it(`Valide`, () => {
      const decoded = decodeDownlink(`55${command.id}01`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(1);
    });
    it(`Invalid throw`, () => {
      expect(() => decodeDownlink(`55${command.id}00`)).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide`, () => {
      const payload = encodeDownlink([{id: command.id}]);
      expect(payload).to.be.equal(`55${command.id}01`);
    });
  });
}

function booleanValidation(command: BooleanDownlinkCommand) {
  describe('Décode', () => {
    it(`Activation`, () => {
      const decoded = decodeDownlink(`55${command.id}01`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(true);
    });
    it(`Désactivation`, () => {
      const decoded = decodeDownlink(`55${command.id}00`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(false);
    });
    it(`Invalide`, () => {
      expect(() => decodeDownlink(`55${command.id}02`)).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Activation`, () => {
      const payload = encodeDownlink([{id: command.id, value: true}]);
      expect(payload).to.be.equal(`55${command.id}01`);
    });
    it(`Désactivation`, () => {
      const payload = encodeDownlink([{id: command.id, value: false}]);
      expect(payload).to.be.equal(`55${command.id}00`);
    });
    it(`Invalide`, () => {
      expect(() => encodeDownlink([{id: command.id, value: 'invalid boolean'}])).to.throw();
    });
  });
}

function numberValidation(command: NumberDownlinkCommand) {
  const value = Math.round(Math.random() * (command.range.max - command.range.min) + command.range.min);
  const hexValue = `55${command.id}${value.toString(16).padStart(command.valueByteSize * 2, '0')}`;
  describe('Décode', () => {
    it(`${value} entre ${command.range.min} <> ${command.range.max}`, () => {
      const decoded = decodeDownlink(hexValue);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0])
        .to.have.property('value')
        .that.equal(value * command.step);
    });
    if (command.range.min > 0) {
      const infValue = 0;
      it(`${infValue} inférieur à ${command.range.min} throw`, () => {
        expect(() =>
          decodeDownlink(`55${command.id}${infValue.toString(16).padStart(command.valueByteSize * 2, '0')}`)
        ).to.throw();
      });
    }
    const supValue = command.range.max + 10;
    it(`${supValue} supérieur à ${command.range.max} throw`, () => {
      expect(() =>
        decodeDownlink(`55${command.id}${supValue.toString(16).padStart(command.valueByteSize * 2, '0')}`)
      ).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide (${value * command.step} ${command.unit || ''})`, () => {
      const payload = encodeDownlink([{id: command.id, value: value * command.step}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Invalide`, () => {
      expect(() => encodeDownlink([{id: command.id, value: 'invalid number'}])).to.throw();
    });
  });
}

function enumValidation(command: EnumDownlinkCommand) {
  const value = Math.round(Math.random() * (command.enum.length - 1));
  const hexValue = `55${command.id}${value.toString(16).padStart(command.valueByteSize * 2, '0')}`;
  describe('Décode', () => {
    it(`${value} [${command.enum[value]}]`, () => {
      const decoded = decodeDownlink(hexValue);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(value);
      expect(decoded[0]).to.and.have.property('enum').that.equal(command.enum[value]);
    });
    const invalid = command.enum.length + 5;
    it(`${invalid} invalid enum value throw`, () => {
      expect(() =>
        decodeDownlink(`55${command.id}${invalid.toString(16).padStart(command.valueByteSize * 2, '0')}`)
      ).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide (${value})`, () => {
      const payload = encodeDownlink([{id: command.id, value}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Valide (${command.enum[value]})`, () => {
      const payload = encodeDownlink([{id: command.id, value: command.enum[value]}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Invalide`, () => {
      expect(() => encodeDownlink([{id: command.id, value: 'invalid enum'}])).to.throw();
      expect(() => encodeDownlink([{id: command.id, value: command.enum.length}])).to.throw();
    });
  });
}

function downlinkCommandValidation(command: DownlinkCommand) {
  switch (command.valueType) {
    case 'command':
      return describe(command.name, () => commandValidation(command));
    case 'boolean':
      return describe(command.name, () => booleanValidation(command));
    case 'number':
      return describe(command.name, () => numberValidation(command));
    case 'enum':
      return describe(command.name, () => enumValidation(command));
  }
}

function getCommandValue(command: DownlinkCommand): {value: any; hexValue: string} {
  switch (command.valueType) {
    case 'command':
      return {value: 1, hexValue: '01'};
    case 'boolean':
      return {value: true, hexValue: '01'};
    case 'number':
      const numberValue = Math.round(Math.random() * (command.range.max - command.range.min) + command.range.min);
      const numberHexValue = numberValue.toString(16).padStart(command.valueByteSize * 2, '0');
      return {value: numberValue * command.step, hexValue: numberHexValue};
    case 'enum':
      const enumValue = Math.round(Math.random() * (command.enum.length - 1));
      return {value: enumValue, hexValue: enumValue.toString(16).padStart(command.valueByteSize * 2, '0')};
  }
}

describe('Nexelecx Codec', () => {
  describe('Downlink', () => {
    DownlinkCommands.forEach(command => downlinkCommandValidation(command));
    describe('Commands', () => {
      const commands: {id: DownlinkId; value: any; hexValue: string}[] = [];
      const partialCommands: {id: DownlinkId; value: any; hexValue: string}[] = [];
      DownlinkCommands.forEach((command, i) => {
        const data = getCommandValue(command);
        commands.push({id: command.id, ...data});
        if (Math.round(Math.random()) === 1) {
          partialCommands.push({id: command.id, ...data});
        }
      });
      const payload = '55' + commands.map(c => `${c.id}${c.hexValue}`).join('');
      const partialPayload = '55' + partialCommands.map(c => `${c.id}${c.hexValue}`).join('');
      describe('Décode', () => {
        it(`Toutes les commandes (${DownlinkCommands.length})`, () => {
          expect(decodeDownlink(payload)).to.be.an('array').that.have.lengthOf(commands.length);
        });
        it(`Une partie des commandes (${partialCommands.length})`, () => {
          expect(decodeDownlink(partialPayload)).to.be.an('array').that.have.lengthOf(partialCommands.length);
        });
        it(`Payload base64`, () => {
          const base64Payload = hexToBase64(payload);
          expect(decodeDownlink(base64Payload, {encoding: 'base64'}))
            .to.be.an('array')
            .that.have.lengthOf(commands.length);
        });
      });
      describe('Encode', () => {
        it(`Toutes les commandes (${DownlinkCommands.length})`, () => {
          const encoded = encodeDownlink(commands.map(c => ({id: c.id, value: c.value})));
          expect(encoded).to.be.equal(payload);
        });
        it(`Une partie des commandes (${partialCommands.length})`, () => {
          const encoded = encodeDownlink(partialCommands.map(c => ({id: c.id, value: c.value})));
          expect(encoded).to.be.equal(partialPayload);
        });
        it(`Payload base64`, () => {
          const encoded = encodeDownlink(
            commands.map(c => ({id: c.id, value: c.value})),
            {encoding: 'base64'}
          );
          expect(encoded).to.be.equal(hexToBase64(payload));
        });
      });
    });
  });
  describe('Uplink', () => {
  });
});
