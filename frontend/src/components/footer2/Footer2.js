import './Footer2.css'
import SocialIcons from "../socialicons/SocialIcons";

const Footer2 = () => {
    return(
        <div className="jsonfooter2">
            <footer2 className="py-4">
            <div className="container">
                <div className="row justify-content-between text-center">
                <div className="col-md-12 text-md-left">
                    <p>
                    Copyright &copy; 2021. new footer
                    </p>
                </div>
                <div className="col-md-12 text-md-right">
                    <SocialIcons />
                </div>
                </div>
            </div>
            </footer2>
        </div>
    );
}

export default Footer2;