import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Pesel from '../pages/Pesel';
import Nip from '../pages/Nip';
import Regon from '../pages/Regon';
import IdCard from '../pages/IdCard';
import BankAccount from '../pages/BankAccount';
import ErrorPage from '../pages/ErrorPage';

const Page = () => {
    return (
        <Switch>
            <Route path="/" exact component={Pesel} />
            <Route path="/nip" component={Nip} />
            <Route path="/regon" component={Regon} />
            <Route path="/idcard" component={IdCard} />
            <Route path="/bankaccount" component={BankAccount} />
            <Route component={ErrorPage} />
        </Switch>
    );
}

export default Page;