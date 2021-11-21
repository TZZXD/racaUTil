const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const unknownConfig = require('./ABIs/unknownABI');
const express = require('express');
const chalk = require('chalk');

const InputDataDecoder = require('ethereum-input-data-decoder');

const app = express();

const { unknown, unknown_addr } = unknownConfig;
const decoder = new InputDataDecoder(unknown);
const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
Contract.setProvider(web3);
const currentContract = new Contract(unknown, unknown_addr);
const account = process.env.my_address;
const privateKey = process.env.my_key;

setInterval(() => {
  currentContract.getPastEvents('allEvents', { toBlock: 'latest' }, function (error, events) {
    if (events) {
      events.forEach(async event => {
        if (
          !event.event &&
          event.raw.topics[3] === '0x000000000000000000000000f24bf668aa087990f1d40ababf841456e771913c'
        ) {
          const eventReceiptInfo = await web3.eth.getTransactionReceipt(event.transactionHash);
          const eventInfo = await web3.eth.getTransaction(event.transactionHash);
          if (eventReceiptInfo && eventInfo) {
            const auctionId = eventReceiptInfo.logs[2].topics[2].split('0x')[1];

            const input = decoder.decodeData(eventInfo.input);
            const price = web3.utils.fromWei(input.inputs[4], 'ether');
            console.log('元兽:', 'auctionId:', auctionId, '总价:', price, 'hash:', event.transactionHash);

            if (Number(price) < 20000) {
              const tx = await currentContract.methods.executeAuction(
                web3.utils.toBN(auctionId),
                web3.utils.toBN(web3.utils.toWei(String(price), 'ether'))
              );
              const raw = await web3.eth.accounts.signTransaction(
                {
                  from: account,
                  to: unknown_addr,
                  value: 0,
                  gas: 200000,
                  data: tx.encodeABI(),
                },
                privateKey
              );

              web3.eth.sendSignedTransaction(raw.rawTransaction).then(res => {
                console.log(res);
              });
            }
          }
        }
      });
    }
  });
}, 3000);

app.listen(3000, console.log(chalk.yellow('Listening for Liquidity Addition to token')));
