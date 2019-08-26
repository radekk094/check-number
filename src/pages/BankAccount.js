import React, { Component } from 'react';

class BankAccount extends Component {
    state = {
        bankAccountCountry: "PL", // country of bank account (default value: PL)
        bankAccountNumber: "", // bank account number from the form
        bankAccountChecked: false, // has the bank account already been checked?
        bankAccountCorrect: false, // is the bank account correct?
        bankName: "" // Bank Name based on the bank account number
    }

    // factors, which are used to check, if the first part of the bank account number (the bank identifier) is correct
    bankIdentifierFactor = "3971397";

    // empty array for the letter converters (from another file) - because the bank account number includes some letters and the App has to replace these letters with numbers
    letterConvertes = [];

    // method, which changes the state with data from the form and resets result of the app (because after changing data, App shouldn't show the result)
    handleChangeBankAccount = (e) => {
        const bankAccountNumber = e.target.value.toString()
        this.setState({
            bankAccountNumber,
            bankAccountChecked: false,
            bankAccountCorrect: false,
            bankName: ""
        });
    }

    // method, which checks, if the bank account number length is correct - and if the length is correct, it calls another method, which checks, if the bank account is correct
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

    // method, which checks, if the first part of the bank account number (the bank identifier) is correct
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

    // method, which sets the Bank Name based on the bank account number and data from another file
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

    // method, which checks, if the bank account is correct
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

    // method, which replace letters, from the bank account number, with numbers
    getNumberFromLetter = (letter) => {
        let number = 0;
        this.letterConverters.forEach(letterConverter => {
            if (letterConverter.letter === letter.toLowerCase()) {
                number = letterConverter.number;
            }
        });
        return number;
    }

    // method, which downloads letter converters from another file and saves it in this component
    fetchLetterConverters = () => {
        fetch('data/letterConverters.json')
            .then(response => response.json())
            .then(data => {
                this.letterConverters = data.converters;
            });
    }

    // method, which is called after first rendering the component - it calls fetch method, which gets letter converters from another file
    componentDidMount() {
        this.fetchLetterConverters();
    }

    // rendering the component with two parts - form to enter bank account number and the program result
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