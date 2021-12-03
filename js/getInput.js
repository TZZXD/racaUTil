const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const unknownConfig = require('./ABIs/unknownABI');
const MonConfig = require('./ABIs/metaMonAbi');
const { metamon_addr, metamon_abi } = MonConfig;
const RACAConfig = require('./ABIs/RACA');
const express = require('express');
const chalk = require('chalk');
const InputDataDecoder = require('ethereum-input-data-decoder');
const app = express();

const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
const { unknown, unknown_addr } = unknownConfig;
const decoder = new InputDataDecoder(metamon_abi);

web3.eth.getTransaction('0x73cc30e49bec2b54fe15b3c3605e6fd80e56f8444e6393bc46f8bb86faa7ab62').then((eve) => {
  const input = decoder.decodeData(eve.input);

  console.log(JSON.stringify(input))
})


// const num = web3.utils.fromWei('4a1d89bb94865ec000000', 'ether')
// console.log(num)
