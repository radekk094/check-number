import React, { Component } from 'react';

class Pesel extends Component {
    state = {
        peselNumber: "",
        peselChecked: false,
        peselCorrect: false,
        gender: "",
        birthDate: ""
    }

    peselFactor = "1379137913";

    handleChangePesel = (e) => {
        const peselNumber = e.target.value.toString()
        this.setState({
            peselNumber,
            peselChecked: false,
            peselCorrect: false,
            gender: "",
            birthDate: ""
        });
    }

    handleSubmitPesel = (e) => {
        e.preventDefault();
        if (this.state.peselNumber.length !== 11) {
            this.setState({
                peselChecked: true,
                peselCorrect: false
            })
        } else {
            this.checkPesel();
        }
    }

    checkPesel = () => {
        let peselElementsSum = 0;

        for (let i = 0; i < 10; i++) {
            peselElementsSum += (this.state.peselNumber[i] * this.peselFactor[i]);
        }

        peselElementsSum = 10 - (peselElementsSum % 10);

        const peselCorrect = ((peselElementsSum % 10) === parseInt(this.state.peselNumber[10]));
        const gender = ((this.state.peselNumber[9] % 2 === 0) ? "kobieta" : "mężczyzna");
        const birthDate = this.checkBirthDate();

        this.setState({
            peselChecked: true,
            peselCorrect,
            gender,
            birthDate
        });
    }

    checkBirthDate = () => {
        let yyFirstPart;

        switch (Math.floor(parseInt(this.state.peselNumber.slice(2, 4)) / 20)) {
            case 0:
                yyFirstPart = 19;
                break;
            case 1:
                yyFirstPart = 20;
                break;
            case 2:
                yyFirstPart = 21;
                break;
            case 3:
                yyFirstPart = 22;
                break;
            default:
                yyFirstPart = 18;
        }

        const yySecondPart = this.state.peselNumber.slice(0, 2);
        const mm = (parseInt(this.state.peselNumber.slice(2, 4)) % 20);
        const dd = this.state.peselNumber.slice(4, 6);

        return `${dd}.${(mm > 9 ? mm : `0${mm}`)}.${yyFirstPart}${yySecondPart}r.`;
    }

    render() {
        return (
            <section className="pesel">
                <form onSubmit={this.handleSubmitPesel}>
                    <span>Podaj numer pesel:</span>
                    <input
                        type="number"
                        value={this.state.peselNumber}
                        onChange={this.handleChangePesel}
                    />
                    <button>Sprawdź</button>
                </form>
                {this.state.peselChecked ? (
                    <div className="result">
                        <h2>Weryfikacja</h2>
                        <p>
                            {this.state.peselCorrect ? (
                                <span className="correct"><i className="fas fa-check-circle"></i> pesel poprawny</span>
                            ) : (
                                    <span className="incorrect"><i className="fas fa-times-circle"></i> pesel błędny</span>
                                )
                            }
                        </p>
                        {this.state.peselCorrect ? (
                            <>
                                <p>Płeć: <span>{this.state.gender}</span></p>
                                <p>Data urodzenia: {this.state.birthDate}</p>
                            </>
                        ) : null}
                    </div>
                ) : null}
            </section>
        );
    }
}

export default Pesel;