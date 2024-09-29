/** @format */

import {expect} from 'chai';

import chai = require('chai');
chai.use(require('chai-like'));
chai.use(require('chai-things'));

import {decodeFromBase64, decodeFromHex, encodeToHex} from './downlink';
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

function commandValidation(command: CommandDownlinkCommand) {
  describe('Décode', () => {
    it(`Valide`, () => {
      const decoded = decodeFromHex(`55${command.id}01`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(1);
    });
    it(`Invalid throw`, () => {
      expect(() => decodeFromHex(`55${command.id}00`)).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide`, () => {
      const payload = encodeToHex([{id: command.id}]);
      expect(payload).to.be.equal(`55${command.id}01`);
    });
  });
}

function booleanValidation(command: BooleanDownlinkCommand) {
  describe('Décode', () => {
    it(`Activation`, () => {
      const decoded = decodeFromHex(`55${command.id}01`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(true);
    });
    it(`Désactivation`, () => {
      const decoded = decodeFromHex(`55${command.id}00`);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(false);
    });
    it(`Invalide`, () => {
      expect(() => decodeFromHex(`55${command.id}02`)).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Activation`, () => {
      const payload = encodeToHex([{id: command.id, value: true}]);
      expect(payload).to.be.equal(`55${command.id}01`);
    });
    it(`Désactivation`, () => {
      const payload = encodeToHex([{id: command.id, value: false}]);
      expect(payload).to.be.equal(`55${command.id}00`);
    });
    it(`Invalide`, () => {
      expect(() => encodeToHex([{id: command.id, value: 'invalid boolean'}])).to.throw();
    });
  });
}

function numberValidation(command: NumberDownlinkCommand) {
  const value = Math.round(Math.random() * (command.range.max - command.range.min) + command.range.min);
  const hexValue = `55${command.id}${value.toString(16).padStart(command.valueByteSize * 2, '0')}`;
  describe('Décode', () => {
    it(`${value} entre ${command.range.min} <> ${command.range.max}`, () => {
      const decoded = decodeFromHex(hexValue);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0])
        .to.have.property('value')
        .that.equal(value * command.step);
    });
    if (command.range.min > 0) {
      const infValue = 0;
      it(`${infValue} inférieur à ${command.range.min} throw`, () => {
        expect(() =>
          decodeFromHex(`55${command.id}${infValue.toString(16).padStart(command.valueByteSize * 2, '0')}`)
        ).to.throw();
      });
    }
    const supValue = command.range.max + 10;
    it(`${supValue} supérieur à ${command.range.max} throw`, () => {
      expect(() =>
        decodeFromHex(`55${command.id}${supValue.toString(16).padStart(command.valueByteSize * 2, '0')}`)
      ).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide (${value * command.step} ${command.unit || ''})`, () => {
      const payload = encodeToHex([{id: command.id, value: value * command.step}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Invalide`, () => {
      expect(() => encodeToHex([{id: command.id, value: 'invalid number'}])).to.throw();
    });
  });
}

function enumValidation(command: EnumDownlinkCommand) {
  const value = Math.round(Math.random() * (command.enum.length - 1));
  const hexValue = `55${command.id}${value.toString(16).padStart(command.valueByteSize * 2, '0')}`;
  describe('Décode', () => {
    it(`${value} [${command.enum[value]}]`, () => {
      const decoded = decodeFromHex(hexValue);
      expect(decoded).to.be.an('array').that.have.lengthOf(1);
      expect(decoded[0]).to.have.property('value').that.equal(value);
      expect(decoded[0]).to.and.have.property('enum').that.equal(command.enum[value]);
    });
    const invalid = command.enum.length + 5;
    it(`${invalid} invalid enum value throw`, () => {
      expect(() =>
        decodeFromHex(`55${command.id}${invalid.toString(16).padStart(command.valueByteSize * 2, '0')}`)
      ).to.throw();
    });
  });
  describe('Encode', () => {
    it(`Valide (${value})`, () => {
      const payload = encodeToHex([{id: command.id, value}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Valide (${command.enum[value]})`, () => {
      const payload = encodeToHex([{id: command.id, value: command.enum[value]}]);
      expect(payload).to.be.equal(hexValue);
    });
    it(`Invalide`, () => {
      expect(() => encodeToHex([{id: command.id, value: 'invalid enum'}])).to.throw();
      expect(() => encodeToHex([{id: command.id, value: command.enum.length}])).to.throw();
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

describe('Nexelec Rise Codec', () => {
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
          expect(decodeFromHex(payload)).to.be.an('array').that.have.lengthOf(commands.length);
        });
        it(`Une partie des commandes (${partialCommands.length})`, () => {
          expect(decodeFromHex(partialPayload)).to.be.an('array').that.have.lengthOf(partialCommands.length);
        });
        it(`Payload base64`, () => {
          const base64Payload = hexToBase64(payload);
          expect(decodeFromBase64(base64Payload)).to.be.an('array').that.have.lengthOf(commands.length);
        });
      });
      describe('Encode', () => {
        it(`Toutes les commandes (${DownlinkCommands.length})`, () => {
          const encoded = encodeToHex(commands.map(c => ({id: c.id, value: c.value})));
          expect(encoded).to.be.equal(payload);
        });
        it(`Une partie des commandes (${partialCommands.length})`, () => {
          const encoded = encodeToHex(partialCommands.map(c => ({id: c.id, value: c.value})));
          expect(encoded).to.be.equal(partialPayload);
        });
      });
    });
  });
});
