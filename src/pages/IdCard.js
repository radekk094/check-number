import React, { Component } from 'react';

class IdCard extends Component {
    state = {
        idCardNumber: "",
        idCardChecked: false,
        idCardCorrect: false
    }

    idCardFactor = "73173173";

    letterConverters = [];

    handleChangeIdCard = (e) => {
        const idCardNumber = e.target.value.toString();
        this.setState({
            idCardNumber,
            idCardChecked: false,
            idCardCorrect: false
        });
    }

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