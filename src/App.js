import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';
import { Block, Container, Wrapper, TransactionsWrapper } from './components';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTransactions, toggleBlockTransactions] = useState(false);
  const [blockDetails, setBlockDetails] = useState();
  const [singleTransactionInfo, setSingleTransactionInfo] = useState();

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

  console.log('singleTransactionInfo', singleTransactionInfo);

  return (
    <React.Fragment>
      <Container>
        <Wrapper>
          <div className="App">Block Number: {blockDetails?.number}</div>
          <Block onClick={handleToggleBlockTransactions}>{blockDetails?.number}</Block>
          <br />
          <span>
            <b>Parent hash:</b> {blockDetails?.parentHash}
          </span>
          <br />
          <b>Block transactions:</b>
          <br />
          {blockTransactions
            ? blockDetails?.transactions?.map((item, index) => {
                return (
                  <TransactionsWrapper key={index}>
                    <button onClick={() => handleTransactionInfo(index)}>{item}</button>
                  </TransactionsWrapper>
                );
              })
            : null}
        </Wrapper>
        <div>
          <p>
            <b>Transaction hash: {singleTransactionInfo?.transactionHash}</b>
          </p>
          <p>
            <b>From: {singleTransactionInfo?.from}</b>
          </p>
          <p>
            <b>To: {singleTransactionInfo?.to}</b>
          </p>
          <p>
            <b>Confirmations: {singleTransactionInfo?.confirmations}</b>
          </p>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default App;
