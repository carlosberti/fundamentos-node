import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator, current) => {
        if (current.type === 'income') {
          accumulator.income += current.value;
          accumulator.total += current.value;
        } else {
          accumulator.outcome += current.value;
          accumulator.total -= current.value;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (balance.total <= value && type === 'outcome') {
      throw Error('Balance not sufficient');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
