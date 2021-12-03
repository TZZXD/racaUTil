const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const unknownConfig = require('./ABIs/unknownABI');
const RACAConfig = require('./ABIs/RACA');
const express = require('express');
const chalk = require('chalk');
const InputDataDecoder = require('ethereum-input-data-decoder');
const app = express();

const { unknown, unknown_addr } = unknownConfig;
const { RACA_ADDR, RACA_ABI } = RACAConfig;
const decoder = new InputDataDecoder(unknown);
const wssUrl = 'https://bsc-dataseed1.binance.org';
const web3 = new Web3(wssUrl);
Contract.setProvider(web3);
const currentContract = new Contract(unknown, unknown_addr);
const racaCurrentContract = new Contract(RACA_ABI, RACA_ADDR);

const account = process.env.my_address + '';
const privateKey = process.env.my_key + '';
// const account = '0x8C3BfD23303bF27ec3eB843e15d014761FbD0c32'
// const privateKey = 'cfa012f6d180ee54fa557518b7438a32f34f6c345591d64bd285bcf2153e9cf4';
let balance
let num = 0

setInterval(() => {
  racaCurrentContract.methods.balanceOf(account + '').call().then(res => {
    balance = Math.floor(web3.utils.fromWei(res, 'ether'))
  })

  currentContract.getPastEvents('allEvents', { toBlock: 'latest' }, function (error, events) {
    if (events) {
      events.forEach(async event => {
        if (
          !event.event &&
          event.raw.topics[3] === '0x00000000000000000000000051353799f8550c9010a8b0cbfe6c02ca96e026e2'
        ) {
          const eventReceiptInfo = await web3.eth.getTransactionReceipt(event.transactionHash);
          const eventInfo = await web3.eth.getTransaction(event.transactionHash);

          if (eventReceiptInfo && eventInfo) {
            const auctionId = eventReceiptInfo.logs[1].topics[2].split('0x')[1];
            const input = decoder.decodeData(eventInfo.input);
            const price = web3.utils.fromWei(input.inputs[4], 'ether');
            const count = web3.utils.fromWei(input.inputs[2], 'wei');

            console.log(
              '药水:',
              auctionId,
              '总价:',
              price,
              '数量:',
              count,
              '单价:',
              price / count,
              'hash:',
              event.transactionHash,
            );
            if (Number(price / count) <= 19000 && price < 30000 && num < 3) {
              num += 1
              console.log(
                '药水:',
                auctionId,
                '总价:',
                price,
                '数量:',
                count,
                '单价:',
                price / count,
                'hash:',
                event.transactionHash,
              );
              const tx = currentContract.methods.executeAuction(
                web3.utils.toBN(auctionId),
                web3.utils.toBN(web3.utils.toWei(String(price), 'ether'))
              );

              const raw = await web3.eth.accounts.signTransaction(
                {
                  from: account,
                  to: unknown_addr,
                  value: 0,
                  gas: 1299999,
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

app.listen(3029, console.log(chalk.yellow('Listening for Liquidity Addition to token')));
