const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const RACAConfig = require('./ABIs/RACA');
const unknownConfig = require('./ABIs/unknownABI');
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

// const account = process.env.my_address + '';
// const privateKey = process.env.my_key + '';
const account = ''
const privateKey = '';

let balance

const egg = '0x000000000000000000000000d40c03b8680d4b6a4d78fc3c6f6a28c854e94a79'
const pos = '0x00000000000000000000000051353799f8550c9010a8b0cbfe6c02ca96e026e2'
const mon = '0x000000000000000000000000f24bf668aa087990f1d40ababf841456e771913c'

setInterval(() => {
  // console.log(process.env.my_address)
  // racaCurrentContract.methods.balanceOf(account + '').call().then(res => {
  //   balance = Math.floor(web3.utils.fromWei(res, 'ether'))
  // })

  currentContract.getPastEvents('allEvents', { toBlock: 'latest' }, function (error, events) {
    if (events) {
      events.forEach(async event => {
        if (
          !event.event && (event.raw.topics[3] === mon)
          // (event.raw.topics[3] === mon || event.raw.topics[3] === egg)
        ) {
          const eventReceiptInfo = await web3.eth.getTransactionReceipt(event.transactionHash);
          const eventInfo = await web3.eth.getTransaction(event.transactionHash);

          if (eventReceiptInfo && eventInfo) {
            let auctionId = '';
            if (event.raw.topics[3] === egg) {
              auctionId = eventReceiptInfo?.logs[1]?.topics[2].split('0x')[1];
            } else {
              auctionId = eventReceiptInfo?.logs[2]?.topics[2].split('0x')[1];
            }
            // const auctionId = eventReceiptInfo.logs[1].topics[2].split('0x')[1];
            const input = decoder.decodeData(eventInfo.input);
            const price = web3.utils.fromWei(input.inputs[4], 'ether');
            const count = web3.utils.fromWei(input.inputs[2], 'wei');

            console.log(
              'mon:',
              auctionId,
              '总价:',
              price,
              '数量:',
              count,
              '单价:',
              price / count,
              'hash:',
              event.transactionHash
            );
            if (Number(price / count) <= 500000 && Number(price) < 1000000) {
              console.log(
                '要购买的mon:',
                auctionId,
                '总价:',
                price,
                '数量:',
                count,
                '单价:',
                price / count,
                'hash:',
                event.transactionHash
              );

              const tx = await currentContract.methods.executeAuction(
                web3.utils.toBN(auctionId),
                web3.utils.toBN(web3.utils.toWei(String(price), 'ether'))
              );

              const raw = await web3.eth.accounts.signTransaction(
                {
                  from: account,
                  to: unknown_addr,
                  value: 0,
                  gasLimit: 2500000,
                  gasPrice: web3.utils.toWei('20', 'gwei'),
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

app.listen(30088, console.log(chalk.yellow('Listening for Liquidity Addition to token')));
