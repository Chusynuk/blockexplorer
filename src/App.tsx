import React, { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { Button, Typography, Input } from '@web3uikit/core';
import { Container, Wrapper, TransactionsWrapper } from './components';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTransactions, toggleBlockTransactions] = useState(false);
  const [blockDetails, setBlockDetails] = useState();
  const [singleTransactionInfo, setSingleTransactionInfo] = useState();
  const [requestHash, setRequestHash] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlockTransactions() {
      setBlockDetails(await alchemy.core.getBlock(blockNumber));
    }
    getBlockTransactions();
  }, [blockNumber]);
  // console.log('blockDetails', blockDetails);

  const handleToggleBlockTransactions = () => {
    toggleBlockTransactions(!blockTransactions);
  };

  const handleTransactionInfo = async (index) => {
    await alchemy.core
      .getTransactionReceipt(blockDetails?.transactions[index])
      .then(setSingleTransactionInfo);
  };

  const handleInputValue = (e: React.ChangeEvent) => {
    setRequestHash(e.target.value);
  };

  const handleBalance = async () => {
    await alchemy.core.getBalance(requestHash).then((balance) => setBalance(balance.toString()));
  };

  return (
    <React.Fragment>
      <Container>
        <Wrapper>
          <Typography variant="h3">Block Number: {blockDetails?.number}</Typography>
          <br />
          <p>Click to display block transactions:</p>
          <Button
            type="button"
            size="regular"
            theme="primary"
            text={blockDetails?.number}
            onClick={handleToggleBlockTransactions}
            style={{ minHeight: '30px' }}
          />
          <br />
          <p>
            <b>Parent hash:</b> {blockDetails?.parentHash}
          </p>
          <b>Block transactions:</b>
          <br />
          {blockTransactions
            ? blockDetails?.transactions?.map((item, index) => {
                return (
                  <TransactionsWrapper key={index}>
                    <Button
                      text={item}
                      theme="tertiary"
                      onClick={() => handleTransactionInfo(index)}
                    />
                  </TransactionsWrapper>
                );
              })
            : null}
        </Wrapper>
        <div>
          <p>
            <Typography variant="subtitle2">Transaction hash:</Typography>{' '}
            {singleTransactionInfo?.transactionHash}
          </p>
          <p>
            <Typography variant="subtitle2">From:</Typography> {singleTransactionInfo?.from}
          </p>
          <p>
            <Typography variant="subtitle2">To:</Typography> {singleTransactionInfo?.to}
          </p>
          <p>
            <Typography variant="subtitle2">Confirmations: </Typography>
            {singleTransactionInfo?.confirmations}
          </p>
        </div>
        <br />
        <Input type="text" label="type hash to see balance" value="" onChange={handleInputValue} />
        <br />
        <Button text="Click to see balace :)" onClick={handleBalance} />
        {balance}
      </Container>
    </React.Fragment>
  );
}

export default App;
