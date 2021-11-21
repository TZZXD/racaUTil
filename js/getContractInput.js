const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const blindConfig = require('./ABIs/racaBlindAbi');
const unknownConfig = require('./ABIs/unknownABI')
const express = require('express');
const chalk = require('chalk');

const InputDataDecoder = require('ethereum-input-data-decoder');

const app = express();

const { Blind_ADDR, Blind_ABI } = blindConfig;
const { unknown, unknown_addr } = unknownConfig;
const decoder = new InputDataDecoder(unknown);
const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
Contract.setProvider(web3);
// const currentContract = new Contract(Blind_ABI, Blind_ADDR);
const currentContract = new Contract(unknown, unknown_addr);

const hash = '0x4d47ee55116783f537a4b5b2ba9f848d71344e81f2e33e070a856f50ca9870a6'

// currentContract.getPastEvents('allEvents', { toBlock: 'latest' }, function (error, events) {
//     console.log(events[0].transactionHash)
// })
// currentContract.getPastEvents('allEvents', {}, function (error, events) {
//     console.log(events)
// })
web3.eth.getTransaction(hash).then(async eventInfo => {
    console.log(eventInfo.input)
    const input = decoder.decodeData(eventInfo.input);
    console.log(JSON.stringify(input))
})

//   const account = '0x38cd73E51d1e3E087bbfa67E37D83274A21A2174';
//   const privateKey = '0x0d2100e3d97c7e461c6a5681e5f930187cba2b446852e331ce0013469e840360';

//   const raw = await web3.eth.accounts.signTransaction(
//     {
//       from: account,
//       to: Blind_ADDR,
//       value: web3.utils.toWei('0', 'ether'),
//       gas: 200000,
//       data: eventInfo.input,
//     },
//     privateKey
//   );

//   web3.eth.sendSignedTransaction(raw.rawTransaction).then(res => {
//     console.log(res);
//   });
// });


