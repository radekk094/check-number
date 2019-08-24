import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

class Navigation extends Component {
    state = {
        navActive: false
    }

    list = [
        { name: "Pesel", path: "/", exact: true },
        { name: "Nip", path: "/nip" },
        { name: "Regon", path: "/regon" },
        { name: "Dowód osobisty", path: "/idcard" },
        { name: "Konto bankowe", path: "/bankaccount" }
    ]

    handleBurgerClick = () => {
        this.setState(prevState => ({
            navActive: !prevState.navActive
        }));
    }

    handleMenuClick = () => {
        this.setState({
            navActive: false
        });
    }

    menu = this.list.map((item) => (
        <li key={item.name}>
            <NavLink
                onClick={this.handleMenuClick}
                to={item.path}
                exact={item.exact ? item.exact : false}
            >
                {item.name}
            </NavLink>
        </li>
    ));

    render() {
        return (
            <nav className={this.state.navActive ? "activeMenu" : ""}>
                <ul>
                    {this.menu}
                </ul>
                <div><i className="fas fa-bars" onClick={this.handleBurgerClick}></i></div>
            </nav>
        );
    }

}

export default Navigation;