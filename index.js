'use strict';

(async () => {
    const { Indexer, CellCollector, TransactionCollector } = require('@ckb-lumos/indexer');
    const indexer = new Indexer('http://127.0.0.1:8334', './indexed-data');
    indexer.startForever();

    setInterval(() => {
        const {block_number} = indexer.tip();
        console.log('tipped', parseInt(block_number, 16));
    }, 1000);

    const lockScript = {
        code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hash_type: 'type',
        // args: '0xc2baa1d5b45a3ad6452b9c98ad8e2cc52e5123c7'
        args: '0xdde7801c073dfb3464c7b1f05b806bb2bbb84e99'
    };

    // const liveCells = indexer.getLiveCellsByLockScript(lockScript);
    // console.log(liveCells);

    const cellCollector = new CellCollector(indexer, {
        lock: lockScript
    });

    const cells = [];
    console.time('fetch cells');
    for await (const cell of cellCollector.collect()) 
        cells.push(cell);
    console.timeEnd('fetch cells');

    console.log('cells count', cells.length);

    const transactionCollector = new TransactionCollector(indexer, {
        lock: lockScript
    });

    const transactions = [];
    console.time('fetch txs');
    for await (const tx of transactionCollector.collect()) 
        transactions.push(tx);
    console.timeEnd('fetch txs');

    console.log('txs count', transactions.length);

})();