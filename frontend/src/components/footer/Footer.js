import './Footer.css'
import SocialIcons from "../socialicons/SocialIcons";

const Footer = () => {
    return (
        <div className="jsonfooter">
            <footer className="py-4">
                <div className="container">
                    <div className="row justify-content-between text-center">
                        <div className="col-md-12 text-md-left">
                            <p>
                                Copyright &copy; 2021.
                            </p>
                        </div>
                        <div className="col-md-12 text-md-right">
                            <SocialIcons />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;