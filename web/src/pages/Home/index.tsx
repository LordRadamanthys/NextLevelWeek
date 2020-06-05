import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>

                <main>
                    <h1>Seu marketplace de coleta de residuo</h1>
                    <p>Ajudamos pessoas a encontrar pontos de coletas de formar eficiente.</p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}


export default Home