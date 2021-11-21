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

const mpb = '0x000000000000000000000000061c6eeca7b14cf4ec1b190dd879008dd7d7e470'
const egg = '0x000000000000000000000000d40c03b8680d4b6a4d78fc3c6f6a28c854e94a79'
const mon = '0x000000000000000000000000f24bf668aa087990f1d40ababf841456e771913c'

setInterval(() => {
  currentContract.getPastEvents('allEvents', { toBlock: 'latest' }, function (error, events) {
    if (events) {
      events.forEach(async event => {
        if (
          !event.event &&
          event.raw.topics[3] === mpb
          // (event.raw.topics[3] === mpb || event.raw.topics[3] === mon || event.raw.topics[3] === egg)
        ) {
          try {
            const eventReceiptInfo = await web3.eth.getTransactionReceipt(event.transactionHash);
            const eventInfo = await web3.eth.getTransaction(event.transactionHash);
            let auctionId = '';
            if (event.raw.topics[3] === egg) {
              auctionId = eventReceiptInfo?.logs[1]?.topics[2].split('0x')[1];
            } else {
              auctionId = eventReceiptInfo?.logs[2]?.topics[2].split('0x')[1];
            }

  
            console.log('eventReceiptInfo', eventReceiptInfo?.logs)
            if (!auctionId) {
              console.log('tpoc', event.raw.topics[3])
            }
            if (eventReceiptInfo && eventInfo && auctionId) {
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
  
              if (Number(price) <= 20000) {
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
                const tx = await currentContract.methods.executeAuction(
                  web3.utils.toBN(auctionId),
                  web3.utils.toBN(web3.utils.toWei(String(price), 'ether'))
                );
  
                const raw = await web3.eth.accounts.signTransaction(
                  {
                    from: account,
                    to: unknown_addr,
                    value: 0,
                    gas: 2000000,
                    gasPrice: web3.utils.toWei('10', 'gwei'),
                    data: tx.encodeABI(),
                  },
                  privateKey
                );

                try {
                  web3.eth.sendSignedTransaction(raw.rawTransaction).then(res => {
                    console.log(res);
                  }).on('error', console.log);
                } catch (e) {
                  console.log('buy error', e)
                }
              }
            }
          } catch (e) {
            console.log('err:' ,e)
          }
        }
      });
    }
  });
}, 1000);

app.listen(30088, console.log(chalk.yellow('Listening for Liquidity Addition to token')));
