import React, { Component } from 'react';

class Nip extends Component {
    state = {
        nipNumber: "", // nip number from the form
        nipChecked: false, // has the nip already been checked?
        nipCorrect: false, // is the nip correct?
        taxOfficeName: "" // Tax Office Name based on the nip number
    }

    // factors, which are used to check, if the nip is correct
    nipFactor = "657234567";

    // method, which changes the state with data from the form and resets result of the app (because after changing data, App shouldn't show the result)
    handleChangeNip = (e) => {
        const nipNumber = e.target.value.toString()
        this.setState({
            nipNumber,
            nipChecked: false,
            nipCorrect: false,
            taxOfficeName: ""
        });
    }

    // method, which checks, if the nip number length is correct - and if the length is correct, it calls another method, which checks, if the nip is correct
    handleSubmitNip = (e) => {
        e.preventDefault();
        if (this.state.nipNumber.length !== 10) {
            this.setState({
                nipChecked: true,
                nipCorrect: false
            })
        } else {
            this.checkNip();
        }
    }

    // method, which checks, if the nip is correct
    checkNip = () => {
        let nipElementsSum = 0;

        for (let i = 0; i < 9; i++) {
            nipElementsSum += this.state.nipNumber[i] * this.nipFactor[i];
        }

        const result = ((nipElementsSum % 11 === 10) ? 0 : (nipElementsSum % 11));
        const nipCorrect = (result === parseInt(this.state.nipNumber[9]));

        this.setState({
            nipChecked: true,
            nipCorrect
        })

        this.fetchTaxOfficeName();
    }

    // method, which sets the Tax Office Name based on the nip number and data from another file
    fetchTaxOfficeName = () => {
        const officeId = this.state.nipNumber.slice(0, 3);

        fetch('data/taxOffices.json')
            .then(response => response.json())
            .then(data => {
                let taxOfficeName = "Brak Urzędu w bazie";
                data.offices.forEach(office => {
                    if (office.id === officeId) {
                        taxOfficeName = office.officeName;
                        return;
                    }
                });
                this.setState({
                    taxOfficeName
                });
            });
    }

    // rendering the component with two parts - form to enter nip number and the program result
    render() {
        return (
            <section className="nip">
                <form onSubmit={this.handleSubmitNip}>
                    <span>Podaj numer nip:</span>
                    <input
                        type="number"
                        value={this.state.nipNumber}
                        onChange={this.handleChangeNip}
                    />
                    <button>Sprawdź</button>
                </form>
                {this.state.nipChecked ? (
                    <div className="result">
                        <h2>Weryfikacja</h2>
                        <p>
                            {this.state.nipCorrect ? (
                                <span className="correct"><i className="fas fa-check-circle"></i> nip poprawny</span>
                            ) : (
                                    <span className="incorrect"><i className="fas fa-times-circle"></i> nip błędny</span>
                                )
                            }
                        </p>
                        {this.state.nipCorrect ? <p>Nazwa urzędu: <span>{this.state.taxOfficeName}</span></p> : null}
                    </div>
                ) : null}
            </section>
        );
    }
}

export default Nip;