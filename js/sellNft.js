const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const unknownConfig = require('./ABIs/unknownABI');
const chalk = require('chalk');
const InputDataDecoder = require('ethereum-input-data-decoder');

const { unknown, unknown_addr } = unknownConfig;
const decoder = new InputDataDecoder(unknown);
const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
Contract.setProvider(web3);
const currentContract = new Contract(unknown, unknown_addr);

const account = process.env.my_address;
const privateKey = process.env.my_key;

// const input = decoder.decodeData('0x467f963d00000000000000000000000051353799f8550c9010a8b0cbfe6c02ca96e026e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000012bb890508c125661e03b09ec06e404bc92890400000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');

// console.log(input, JSON.stringify(input));
const tx =
    currentContract.methods.sell(web3.utils.toHex('F24Bf668Aa087990f1d40aBAbF841456E771913c'), web3.utils.toBN(257175), web3.utils.toBN(1), web3.utils.toHex('12bb890508c125661e03b09ec06e404bc9289040'), web3.utils.toBN(web3.utils.toWei(String(50100000), 'ether'))
        , web3.utils.toBN(0), web3.utils.toBN(0))

web3.eth.accounts.signTransaction(
    {
        from: account,
        to: unknown_addr,
        value: 0,
        gas: 2637914,
        data: tx.encodeABI(),
    },
    privateKey
).then(raw => {
    console.log(tx.encodeABI());

    console.log(JSON.stringify(decoder.decodeData(tx.encodeABI())));

    web3.eth.sendSignedTransaction(raw.rawTransaction).then(res => {
        console.log(res);
    })
}

)





