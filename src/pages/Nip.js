import React, { Component } from 'react';

class Nip extends Component {
    state = {
        nipNumber: "",
        nipChecked: false,
        nipCorrect: false,
        taxOfficeName: ""
    }

    nipFactor = "657234567";

    handleChangeNip = (e) => {
        const nipNumber = e.target.value.toString()
        this.setState({
            nipNumber,
            nipChecked: false,
            nipCorrect: false,
            taxOfficeName: ""
        });
    }

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