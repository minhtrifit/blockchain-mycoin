import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import elliptic from "elliptic";
import { v4 as uuidv4 } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TransactionType, WalletType } from "@/types";
import { signTransaction } from "@/helpers/transaction";
import { createTransaction } from "@/redux/actions/blockchain.action";

interface TransactionFormType {
  toAddress: string;
  amount: number;
}

const Send = () => {
  const ec = new elliptic.ec("secp256k1");

  const dispatch = useDispatch();

  const userWallet = useSelector<RootState, WalletType | null>(
    (state) => state.users.wallet
  );

  const transactions = useSelector<RootState, TransactionType[] | undefined>(
    (state) => state.blockchains.MyCoin.transactions
  );

  const [transactionForm, setTransactionForm] = useState<TransactionFormType>({
    toAddress: "",
    amount: 0,
  });
  const [startMining, setStartMining] = useState<boolean>(false);

  const handleCreateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myWalletAddress = userWallet?.address;
    const myWalletPrivateKey = userWallet?.privateKey;

    const tx: TransactionType = {
      fromAddress: userWallet?.address,
      toAddress: transactionForm.toAddress,
      amount: transactionForm.amount,
    };

    if (myWalletAddress && myWalletPrivateKey) {
      const myKey = ec.keyFromPrivate(myWalletPrivateKey);

      signTransaction(tx, myKey);
      dispatch(createTransaction(tx));

      setStartMining(true);
    }

    setTransactionForm({
      toAddress: "",
      amount: 0,
    });
  };

  const handleStartMining = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const myWalletAddress = userWallet?.address;

    if (myWalletAddress) {
      // Starting miner...
      // dispatch(minePendingTransactions(myWalletAddress));
    }

    setStartMining(false);
  };

  return (
    <div className="mt-[60px] p-6 flex flex-col gap-10">
      <img
        className="w-[100%] h-[150px] md:h-[300px] object-cover rounded-md"
        src="/assets/banner-1.png"
        alt="banner-1"
      />
      {startMining ? (
        <form
          className="bg-white p-6 rounded-md flex flex-col gap-5"
          onSubmit={(e) => {
            handleStartMining(e);
          }}
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-primary-green">
              Pending transactions
            </h1>
            <p>
              These transactions are waiting to be included in the next block.
              Next block is created when you start mining the process.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">From address</TableHead>
                <TableHead className="w-[300px]">To address</TableHead>
                <TableHead className="w-[300px]">Signature</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => {
                return (
                  <TableRow key={uuidv4()}>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction?.fromAddress}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction?.toAddress}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction?.signature}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {transaction?.amount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <button
            type="submit"
            className="mt-10 w-[250px] bg-primary-green p-4 font-bold text-white rounded-md"
          >
            Start mining
          </button>
        </form>
      ) : (
        <form
          className="bg-white p-6 rounded-md flex flex-col gap-5"
          onSubmit={(e) => {
            handleCreateTransaction(e);
          }}
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-primary-green">
              Create transaction
            </h1>
            <p>Transfer some money to someone!</p>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold">Your address</h1>
            <Input defaultValue={userWallet?.address} disabled />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold">To address</h1>
            <Input
              value={transactionForm?.toAddress}
              onChange={(e) => {
                setTransactionForm({
                  ...transactionForm,
                  toAddress: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold">Amount</h1>
            <Input
              value={transactionForm?.amount}
              onChange={(e) => {
                setTransactionForm({
                  ...transactionForm,
                  amount: Number(e.target.value),
                });
              }}
            />
          </div>
          <button
            type="submit"
            className="mt-10 w-[250px] bg-primary-green p-4 font-bold text-white rounded-md"
          >
            Sign & create transaction
          </button>
        </form>
      )}
    </div>
  );
};

export default Send;
