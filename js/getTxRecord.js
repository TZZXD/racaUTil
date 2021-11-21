const Web3 = require('web3');
const Contract = require('web3-eth-contract')
const racaConfig = require('./ABIs/RACA')
const dayjs = require('dayjs');
const express = require('express');
var xlsx = require('node-xlsx');
var fs = require('fs');
const { exit } = require('process');

const { RACA_ABI, RACA_ADDR } = racaConfig
const wssUrl = 'wss://bsc-ws-node.nariox.org:443';
const web3 = new Web3(wssUrl);
Contract.setProvider(web3);
const currentContract = new Contract(RACA_ABI, RACA_ADDR);

let formData = [[
  'From',
  'To',
  'Raca',
  'Time',
  'TxHash'
]]

const limitTime = '2021-11-13 06:11';
const Wallet_addr = '';

var events = currentContract.events.allEvents({}, (err, res) => {
  if (Date.now() > new Date(limitTime)) {
    let data = [
      {
          name : 'raca_transfer',
          data : formData
      }
    ]

    // 写xlsx
    var buffer = xlsx.build(data);
    fs.writeFile(`./raca.xls`, buffer, (err) => {
      if (err)
          throw err;
      console.log('Write to xls has finished');
      exit(0)
      // 读xlsx
        // var obj = xlsx.parse("./" + "resut.xls");
        // console.log(JSON.stringify(obj));
      }
    );
  }
  if (res.event === 'Transfer' && Date.now() < new Date(limitTime)) {
    const { transactionHash, returnValues: result } = res;
    const { from, to, value } = result;
    if (to === Wallet_addr) {
        formData.push([from, to, Math.floor(web3.utils.fromWei(value, 'ether')), dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'), transactionHash])
        console.log(`from:${from} to:${to} Value:${web3.utils.fromWei(value, 'ether')} hash: ${transactionHash}`)
    }
  }
});
