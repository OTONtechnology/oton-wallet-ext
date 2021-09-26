import protobuf from 'protobufjs';
import * as proto from './tx.proto';

const { root } = protobuf.parse(proto.default, { keepCase: true });

export const SendCoins = root.lookupType('otoncoin.SendCoins');
export const MintCoins = root.lookupType('otoncoin.MintCoins');
export const Raw = root.lookupType('otoncoin.Raw');
