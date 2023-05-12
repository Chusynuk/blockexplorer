// @ts-ignore
import React, { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import {
  ChakraProvider,
  Flex,
  Center,
  Stack,
  Container,
  Box,
  Text,
  Button,
  List,
  ListItem,
  Input,
  Heading,
  ListIcon,
} from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
// import { Center, Wrapper, TransactionsWrapper } from './components';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  const [blockTransactions, toggleBlockTransactions] = useState(false);
  const [blockDetails, setBlockDetails] = useState();
  const [singleTransactionInfo, setSingleTransactionInfo] = useState();
  const [requestHash, setRequestHash] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber()); // .getBlockNumber returns the block number of the most recently mined block
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

  const handleTransactionInfo = async (index: string | number) => {
    await alchemy.core
      .getTransactionReceipt(blockDetails?.transactions[index])
      .then(setSingleTransactionInfo);
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestHash(e.target.value);
  };

  const handleBalance = async () => {
    await alchemy.core.getBalance(requestHash).then((balance) => setBalance(balance.toString()));
  };

  const handleOnKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBalance();
    }
  };

  const handleGetLatestTransactions = async () =>
    setBlockNumber(await alchemy.core.getBlockNumber());

  return (
    <React.Fragment>
      <ChakraProvider>
        <Flex>
          <Flex direction="column" w="100vw" p="2">
            {/* <Box flex="1" h="300px">
              <Text>hello</Text>
            </Box> */}
            <Button colorScheme="teal" variant="solid" mb="2" onClick={handleGetLatestTransactions}>
              Get most recently mined block
            </Button>
            <Center bg="#262525" h="100vh" color="white">
              <Flex>
                <Flex direction="column">
                  <Box
                    style={{ border: '1px solid black', overflowY: 'scroll', borderRadius: '15px' }}
                    w="1100px"
                    h="600px"
                    align="center"
                  >
                    <Heading as="h6" mb="4">
                      Block Number: {blockDetails?.number}
                    </Heading>
                    <Text mb="2">Click to display block transactions:</Text>
                    <Button
                      size="md"
                      colorScheme="teal"
                      mb="3"
                      onClick={handleToggleBlockTransactions}
                    >
                      {blockDetails?.number}
                    </Button>
                    <Flex justify="center" align="center">
                      <Text as="b">Parent hash: </Text>
                      <Text>{blockDetails?.parentHash}</Text>
                    </Flex>
                    <Flex justify="start" mt="5">
                      <List>
                        <Text mb="3">Block transactions:</Text>

                        {blockTransactions
                          ? blockDetails?.transactions?.map(
                              (item: string | undefined, index: React.Key | null | undefined) => {
                                return (
                                  <ListItem>
                                    <ListIcon as="CheckIcon" color="green.500" />
                                    <Button
                                      size="sm"
                                      colorScheme="yellow"
                                      mb="1"
                                      onClick={() => handleTransactionInfo(index)}
                                    >
                                      {item}
                                    </Button>
                                  </ListItem>
                                );
                              },
                            )
                          : null}
                      </List>
                    </Flex>
                    {/* {blockTransactions
                      ? blockDetails?.transactions?.map(
                          (item: string | undefined, index: React.Key | null | undefined) => {
                            return (
                              <TransactionsWrapper key={index}>
                                <Button
                                  key={index}
                                  text={item}
                                  theme="secondary"
                                  onClick={() => handleTransactionInfo(index)}
                                />
                              </TransactionsWrapper>
                            );
                          },
                        )
                      : null} */}
                  </Box>
                  <Flex direction="column" mt="5">
                    <Text>
                      <Text>Transaction hash:</Text> {singleTransactionInfo?.transactionHash}
                    </Text>
                    <Text mt="3">
                      <Text>From:</Text> {singleTransactionInfo?.from}
                    </Text>
                    <Text mt="3">
                      <Text>To:</Text> {singleTransactionInfo?.to}
                    </Text>
                    <Text mt="3">
                      <Text>Confirmations: </Text>
                      {singleTransactionInfo?.confirmations}
                    </Text>
                  </Flex>

                  <Input
                    type="text"
                    label="type hash to see balance"
                    onChange={handleInputValue}
                    onKeyDown={handleOnKeyPressed}
                  />

                  <Button text="Click to see balance :)" onClick={handleBalance} />
                  {balance}
                </Flex>
              </Flex>
            </Center>
          </Flex>
        </Flex>
        {/* <Center>
          <Wrapper>
            <Typography variant="h3">Block Number: {blockDetails?.number}</Typography>

            <p>Click to display block transactions:</p>
            <Button
              type="button"
              size="regular"
              theme="primary"
              text={blockDetails?.number}
              onClick={handleToggleBlockTransactions}
              style={{ minHeight: '30px' }}
            />

            <p>
              <b>Parent hash:</b> {blockDetails?.parentHash}
            </p>
            <b>Block transactions:</b>

            {blockTransactions
              ? blockDetails?.transactions?.map(
                  (item: string | undefined, index: React.Key | null | undefined) => {
                    return (
                      <TransactionsWrapper key={index}>
                        <Button
                          key={index}
                          text={item}
                          theme="secondary"
                          onClick={() => handleTransactionInfo(index)}
                        />
                      </TransactionsWrapper>
                    );
                  },
                )
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

          <Input
            type="text"
            label="type hash to see balance"
            value=""
            onChange={handleInputValue}
            onKeyDown={handleOnKeyPressed}
          />

          <Button text="Click to see balance :)" onClick={handleBalance} />
          {balance}
        </Center> */}
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;
