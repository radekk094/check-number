import React, { Component } from 'react';

class IdCard extends Component {
    state = {
        idCardNumber: "", // ID card number from the form
        idCardChecked: false, // has the ID card already been checked?
        idCardCorrect: false // is the ID card correct?
    }

    // factors, which are used to check, if the ID card is correct
    idCardFactor = "73173173";

    // empty array for the letter converters (from another file) - because the ID card number includes some letters and the App has to replace these letters with numbers
    letterConverters = [];

    // method, which changes the state with data from the form and resets result of the app (because after changing data, App shouldn't show the result)
    handleChangeIdCard = (e) => {
        const idCardNumber = e.target.value.toString();
        this.setState({
            idCardNumber,
            idCardChecked: false,
            idCardCorrect: false
        });
    }

    // method, which checks, if the ID card number length is correct - and if the length is correct, it calls another method, which checks, if the ID card is correct
    handleSubmitIdCard = (e) => {
        e.preventDefault();
        if (this.state.idCardNumber.length !== 9) {
            this.setState({
                idCardChecked: true,
                idCardCorrect: false
            })
        } else {
            this.checkIdCard();
        }
    }

    // method, which checks, if the ID card is correct
    checkIdCard = () => {
        const idCardLetters = this.state.idCardNumber.slice(0, 3);
        const idCardDigits = this.state.idCardNumber.slice(4);

        let idCardElementsSum = 0;

        for (let i = 0; i < 3; i++) {
            const numberFromLetter = this.getNumberFromLetter(idCardLetters[i])
            if (numberFromLetter === 0) {
                this.setState({
                    idCardChecked: true,
                    idCardCorrect: false
                });
                return;
            }
            idCardElementsSum += (numberFromLetter * this.idCardFactor[i]);
        }

        for (let i = 0; i < 5; i++) {
            idCardElementsSum += (idCardDigits[i] * this.idCardFactor[i]);
        }

        const idCardCorrect = ((idCardElementsSum % 10) === parseInt(this.state.idCardNumber[3]));

        this.setState({
            idCardChecked: true,
            idCardCorrect
        });
    }

    // method, which replace letters, from the ID card number, with numbers
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

    // rendering the component with two parts - form to enter ID card number and the program result
    render() {
        return (
            <section className="idCard">
                <form onSubmit={this.handleSubmitIdCard}>
                    <span>Podaj numer dowodu:</span>
                    <input
                        type="text"
                        value={this.state.idCardNumber}
                        onChange={this.handleChangeIdCard}
                    />
                    <button>Sprawdź</button>
                </form>
                {this.state.idCardChecked ? (
                    <div className="result">
                        <h2>Weryfikacja</h2>
                        <p>
                            {this.state.idCardCorrect ? (
                                <span className="correct"><i className="fas fa-check-circle"></i> numer poprawny</span>
                            ) : (
                                    <span className="incorrect"><i className="fas fa-times-circle"></i> numer błędny</span>
                                )
                            }
                        </p>
                    </div>
                ) : null}
            </section>
        );
    }
}

export default IdCard;