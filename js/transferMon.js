const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const MonConfig = require('./ABIs/metaMonAbi');
const RACAConfig = require('./ABIs/RACA');
const express = require('express');
const chalk = require('chalk');
const InputDataDecoder = require('ethereum-input-data-decoder');
const app = express();

const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
const { metamon_addr, metamon_abi } = MonConfig;
const currentContract = new Contract(metamon_abi, metamon_addr);
// const decoder = new InputDataDecoder(unknown);

const account = ''
const privateKey = '';

const tx = currentContract.methods.safeTransferFrom(
  '0xC2033B119DB745c979578deD4c2737F937B54faa',
  '0x7b305279E898FCeE952207024Ccd7431341fE956',
  web3.utils.toBN('502556'),
);

web3.eth.accounts.signTransaction(
  {
    from: account,
    to: metamon_addr,
    value: 0,
    gasLimit: 2500000,
    gasPrice: web3.utils.toWei('5', 'gwei'),
    data: tx.encodeABI(),
  },
  privateKey
).then((raw) => {
  web3.eth.sendSignedTransaction(raw.rawTransaction).then(res => {
    console.log(res);
  });
})


// const input = decoder.decodeData('0x991a4794a811a7e873203071f6fd72e19aebac511de3cccf4f700044d1e9adf4');
// console.log(JSON.stringify(input))

// const num = web3.utils.fromWei('4a1d89bb94865ec000000', 'ether')
// console.log(num)
