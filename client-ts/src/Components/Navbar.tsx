import {Link, useLocation} from "react-router-dom";

interface AutomaticLinkProps {
    href: string
    placeholder: string
}

function AutomaticLink({href, placeholder}: AutomaticLinkProps) {
    const location = useLocation()

    return (
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === href ? 'active' : ''}`} aria-current="page"
                  to={href}>{placeholder}</Link>
        </li>
    )
}

function Navbar() {

    return (
        <nav className="navbar navbar-expand-lg bg-body-secondary sticky-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Chat-App</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
            <div className="collapse navbar-collapse mx-2" id="navbarNav">
                <ul className="navbar-nav mb-lg-0">
                    <AutomaticLink href="/" placeholder={"Home"}/>
                    <AutomaticLink href="/login" placeholder={"login"}/>
                    <AutomaticLink href="/products" placeholder={"Products"}/>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar