import React, { Component } from 'react';

class BankAccount extends Component {
    state = {
        bankAccountCountry: "PL",
        bankAccountNumber: "",
        bankAccountChecked: false,
        bankAccountCorrect: false,
        bankName: ""
    }

    bankIdentifierFactor = "3971397";

    letterConvertes = [];

    handleChangeBankAccount = (e) => {
        const bankAccountNumber = e.target.value.toString()
        this.setState({
            bankAccountNumber,
            bankAccountChecked: false,
            bankAccountCorrect: false,
            bankName: ""
        });
    }

    handleSubmitBankAccount = (e) => {
        e.preventDefault();
        if (this.state.bankAccountNumber.length !== 26) {
            this.setState({
                bankAccountChecked: true,
                bankAccountCorrect: false
            });
        } else {
            const bankAccountCorrect = (this.checkBankIdentifier() && this.checkBankAccount());
            this.setState({
                bankAccountChecked: true,
                bankAccountCorrect
            });
        }
    }

    checkBankIdentifier = () => {
        const bankIdentifier = this.state.bankAccountNumber.slice(2, 10);
        let bankIdentifierElementsSum = 0;

        for (let i = 0; i < 7; i++) {
            bankIdentifierElementsSum += bankIdentifier[i] * this.bankIdentifierFactor[i];
        }

        bankIdentifierElementsSum = 10 - (bankIdentifierElementsSum % 10);
        const isCorrect = ((bankIdentifierElementsSum % 10) === parseInt(bankIdentifier[7]));

        this.fetchBankName();
        return isCorrect;
    }

    fetchBankName = () => {
        const bankId = this.state.bankAccountNumber.slice(2, 6);

        fetch('data/bankNames.json')
            .then(response => response.json())
            .then(data => {
                let bankName = "Brak banku w bazie";
                data.banks.forEach(bank => {
                    if (bank.id === bankId) {
                        bankName = bank.bankName;
                        return;
                    }
                });
                this.setState({
                    bankName
                });
            });
    }

    checkBankAccount = () => {
        let accountToCheck = this.state.bankAccountNumber.slice(2);
        for (let i = 0; i < 2; i++) {
            const numberFromLetter = this.getNumberFromLetter(this.state.bankAccountCountry[i]);
            if (numberFromLetter === 0) {
                this.setState({
                    bankAccountChecked: true,
                    bankAccountCorrect: false
                });
                return;
            }
            accountToCheck += numberFromLetter
        }
        accountToCheck += this.state.bankAccountNumber.slice(0, 2);

        let rest = 0;

        for (let i = 0; i < 4; i++) {
            let numberToCount = 0;
            if (i === 3) {
                numberToCount = rest + accountToCheck.slice(24);
            } else {
                numberToCount = rest + accountToCheck.slice((8 * i), (8 * i + 8));
            }
            rest = numberToCount % 97;
        }

        return (rest === 1);
    }

    getNumberFromLetter = (letter) => {
        let number = 0;
        this.letterConverters.forEach(letterConverter => {
            if (letterConverter.letter === letter.toLowerCase()) {
                number = letterConverter.number;
            }
        });
        return number;
    }

    fetchLetterConverters = () => {
        fetch('data/letterConverters.json')
            .then(response => response.json())
            .then(data => {
                this.letterConverters = data.converters;
            });
    }

    componentDidMount() {
        this.fetchLetterConverters();
    }

    render() {
        return (
            <section className="bankAccount">
                <form onSubmit={this.handleSubmitBankAccount}>
                    <span>Podaj numer konta:</span>
                    <div className="bankAccount">
                        <input
                            type="text"
                            value={this.state.bankAccountCountry}
                            readOnly={true}
                        />
                        <input
                            type="number"
                            value={this.state.bankAccountNumber}
                            onChange={this.handleChangeBankAccount}
                        />
                    </div>
                    <button>Sprawdź</button>
                </form>
                {this.state.bankAccountChecked ? (
                    <div className="result">
                        <h2>Weryfikacja</h2>
                        <p>
                            {this.state.bankAccountCorrect ? (
                                <span className="correct"><i className="fas fa-check-circle"></i> numer poprawny</span>
                            ) : (
                                    <span className="incorrect"><i className="fas fa-times-circle"></i> numer błędny</span>
                                )
                            }
                        </p>
                        {this.state.bankAccountCorrect ? <p>Nazwa banku: <span>{this.state.bankName}</span></p> : null}
                    </div>
                ) : null}
            </section>
        );
    }
}

export default BankAccount;