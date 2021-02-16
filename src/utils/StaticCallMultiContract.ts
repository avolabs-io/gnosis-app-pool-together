/* eslint-disable @typescript-eslint/ban-types */
import { JsonFragment } from '@ethersproject/abi';

export class Contract {
  private _address: string;
  private _abi: JsonFragment[];
  private _functions: JsonFragment[];

  get address() {
    return this._address;
  }

  get abi() {
    return this._abi;
  }

  get functions() {
    return this._functions;
  }

  constructor(address: string, abi: JsonFragment[]) {
    this._address = address;
    this._abi = abi;

    this._functions = abi.filter(x => x.type === 'function');
    //const callFunctions = this._functions.filter(x => x.stateMutability === 'pure' || x.stateMutability === 'view');

    for (const callFunction of this._functions) {
      const { name } = callFunction;
      if(!name) continue;
      const getCall = makeCallFunction(this, name);
      if(!getCall) continue;
      if (!this[name]) {
        defineReadOnly(this, name, getCall);
      }
    }
  }

  [method: string]: any;
}

function makeCallFunction(contract: Contract, name: string) {
  return (...params: any[]) => {
    const { address } = contract;
    const a = contract.functions.find(f => f.name === name);
    if(!a) return;
    const { inputs } = a;
    const b = contract.functions.find(f => f.name === name);
    if(!b) return;
    const { outputs } = b;
    return {
      contract: {
        address,
      },
      name,
      inputs,
      outputs,
      params,
    };
  };
}

function defineReadOnly(object: object, name: string, value: unknown) {
  Object.defineProperty(object, name, {
    enumerable: true,
    value,
    writable: false,
  });
}