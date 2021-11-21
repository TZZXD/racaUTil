const showDetail = (abi) => {
    const funs = []
    abi.forEach((item) => {
        const temp = {}
        if (item.inputs) {
            temp.name = item.name
            temp.input = JSON.stringify(item.inputs.map((input) => ({name: input.name, type: input.type})))
        }
        if (item.outputs) {
            temp.output = JSON.stringify(item.outputs.map((output) => ({name: output.name, type: output.type})))
        }
        if (item.stateMutability) {
            temp.stateMutability = item.stateMutability;
        }
        funs.push(temp)
    })
    console.log(funs)
}

module.exports = showDetail