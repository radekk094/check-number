import React, { Component } from 'react';

class Regon extends Component {
    state = {
        regonNumber: "", // regon number from the form
        regonChecked: false, // has the regon already been checked?
        regonCorrect: false // is the regon correct?
    }

    // factors, which are used to check, if the regon is correct (there are two variants of factor, because thera are two variants of regon - nine-digit and fourteen-digit)
    regonFactor = "89234567";
    regonFactorLong = "2485097361248";

    // method, which changes the state with data from the form and resets result of the app (because after changing data, App shouldn't show the result)
    handleChangeRegon = (e) => {
        const regonNumber = e.target.value.toString()
        this.setState({
            regonNumber,
            regonChecked: false,
            regonCorrect: false
        });
    }

    // method, which checks, if the regon number length is correct - and if the length is correct, it calls another method, which checks, if the regon is correct (there are two methods to check the correctness of the regon, because there are two variants of regon - nine-digit and fourteen-digit)
    handleSubmitRegon = (e) => {
        e.preventDefault();
        if (this.state.regonNumber.length === 9) {
            const regonCorrect = this.checkRegon();
            this.setState({
                regonChecked: true,
                regonCorrect
            })
        } else if (this.state.regonNumber.length === 14) {
            const regonCorrect = (this.checkRegon() && this.checkRegonLong());
            this.setState({
                regonChecked: true,
                regonCorrect
            })
        } else {
            this.setState({
                regonChecked: true,
                regonCorrect: false
            })
        }
    }

    // method, which checks, if the nine-digit regon is correct
    checkRegon = () => {
        let regonElementsSum = 0;

        for (let i = 0; i < 8; i++) {
            regonElementsSum += this.state.regonNumber[i] * this.regonFactor[i];
        }

        const result = ((regonElementsSum % 11 === 10) ? 0 : (regonElementsSum % 11));
        const isCorrect = (result === parseInt(this.state.regonNumber[8]));

        return isCorrect;
    }

    // method, which checks, if the fourteen-digit regon is correct
    checkRegonLong = () => {
        let regonElementsSum = 0;

        for (let i = 0; i < 13; i++) {
            regonElementsSum += this.state.regonNumber[i] * this.regonFactorLong[i];
        }

        const result = ((regonElementsSum % 11 === 10) ? 0 : (regonElementsSum % 11));
        const isCorrect = (result === parseInt(this.state.regonNumber[13]));

        return isCorrect;
    }

    // rendering the component with two parts - form to enter regon number and the program result
    render() {
        return (
            <section className="regon">
                <form onSubmit={this.handleSubmitRegon}>
                    <span>Podaj numer regon:</span>
                    <input
                        type="number"
                        value={this.state.regonNumber}
                        onChange={this.handleChangeRegon}
                    />
                    <button>Sprawdź</button>
                </form>
                {this.state.regonChecked ? (
                    <div className="result">
                        <h2>Weryfikacja</h2>
                        <p>
                            {this.state.regonCorrect ? (
                                <span className="correct"><i className="fas fa-check-circle"></i> regon poprawny</span>
                            ) : (
                                    <span className="incorrect"><i className="fas fa-times-circle"></i> regon błędny</span>
                                )
                            }
                        </p>
                    </div>
                ) : null}
            </section>
        );
    }
}

export default Regon;