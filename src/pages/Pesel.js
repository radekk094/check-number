import React, { Component } from 'react';

class Pesel extends Component {
    state = {
        peselNumber: "", // pesel number from the form
        peselChecked: false, // has the pesel already been checked?
        peselCorrect: false, // is the pesel correct?
        gender: "", // gender based on the pesel
        birthDate: "" // date of birth based on the pesel
    }

    // factors, which are used to check, if the pesel is correct
    peselFactor = "1379137913";

    // method, which changes the state with data from the form and resets result of the app (because after changing data, App shouldn't show the result)
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

    // method, which checks, if the pesel number length is correct - and if the length is correct, it calls another method, which checks, if the pesel is correct
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

    // method, which checks, if the pesel is correct and it also sets gender based on the pesel
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

    // method, which sets date of birth based on the pesel
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

    // rendering the component with two parts - form to enter pesel number and the program result
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