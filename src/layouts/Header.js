import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <>
            <Switch>
                <Route path="/" exact render={() => (
                    <h1>Sprawdź numer <span>pesel</span></h1>
                )} />
                <Route path="/nip" render={() => (
                    <h1>Sprawdź numer <span>nip</span></h1>
                )} />
                <Route path="/regon" render={() => (
                    <h1>Sprawdź numer <span>regon</span></h1>
                )} />
                <Route path="/idcard" render={() => (
                    <h1>Sprawdź numer <span>dowodu&nbsp;osobistego</span></h1>
                )} />
                <Route path="/bankaccount" render={() => (
                    <h1>Sprawdź numer <span>konta&nbsp;bankowego</span></h1>
                )} />
                <Route render={() => (
                    <h1>Strona nie istnieje</h1>
                )} />
            </Switch>
        </>
    );
}

export default withRouter(Header);