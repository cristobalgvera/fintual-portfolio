# :technologist: Fintual Portfolio

Exercise-like project to reach Fintual interview.

Project itself do nothing, it just can run tests to prove portfolio functionality.

## TL;DR

```bash
# Clone this repository
git clone https://github.com/cristobalgvera/fintual-portfolio.git

# Open project folder
cd fintual-portfolio

# Install dependencies
npm install # yarn

# Run tests
npm test # yarn test
```

## :person_fencing: Problem definition

Construct a simple Portfolio class that has a collection of Stocks
and a "Profit" method that receives 2 dates and returns the profit
of the Portfolio between those dates. Assume each Stock has a "Price"
method that receives a date and returns its price.

Bonus Track: make the Profit method return the "annualized return"
of the portfolio between the given dates.

## :card_index_dividers: Repository structure

Repository has two branches: main and annualized-return. The branch _main_
contains base requested functionality. In the other hand, _annualized-return_
branch contains bonus track part.

## :eyes: Disclaimer

I don't really know how to calculate annualized profit or even cumulative profit,
obviously I did my research about it, but maybe the implementation has calculation
related problems.
