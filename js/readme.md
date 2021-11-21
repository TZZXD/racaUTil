使用方法
控制台 node .\js\ABIs\BMM.js
就会打印对应abi的 每个函数，name/input/output （每个值都可能为空）
例如
```js
{
    name: 'balanceOf',
    input: '[{"name":"account","type":"address"}]',
    output: '[{"name":"","type":"uint256"}]',
    stateMutability: 'nonpayable'
},
这个应该调用
const contract = new Contract(abi, addr);
const balance = await contract.methods.balanceOf(account).call()

根据 stateMutability种类的不同，调用方法会有区别，不涉及tx类的用上面就可以调用
涉及到tx类的需要加参数，具体参数需要看abi里的解析
contract.methods.aabbxx(params).send({
    from: account,
    value: 0
}, (err, txHash) => {});

写合约的老哥可以参考
```
获取监控方法 
先安装node环境    
``` npm run getContract ```
然后直接请求
``` https://127.0.0.1:3000```就可以拿到对应的最近上架的bsc链路地址

<h3> 通过页面中是否含有下面这个链接来判断nft类型 </h3>

- 元兽: https://bscscan.com/token/0xf24bf668aa087990f1d40ababf841456e771913c

- 药水: xxxxx


<h3> 对于nft市场url需要解析出页面a标签ID </h3>

 - https://bscscan.com/token/0xf24bf668aa087990f1d40ababf841456e771913c?a=${id}
