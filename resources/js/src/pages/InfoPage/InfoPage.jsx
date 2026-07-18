import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBInfoPage } from "../../services/baseService";
import  parse  from "html-react-parser";
import { useLanguage } from "../../contexts/LanguageContext";



const InfoPage = () => {
    
    const [ page, setPage ] = useState(null);
    
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const { language } = useLanguage(); 

    useEffect(() => {

        getBInfoPage(slug)
            .then(result => {
                if (result.success && result.data.is_active) {
                    setPage(result.data);
                } else {
                    navigate('/');
                }
            })
            .catch(error => {
                navigate('/');
            })
    }, [slug])

    return (
        <div className="container mx-auto text-white lg:mt-10 mb-10">
            <h1 className="text-center ">{page?.title[language]}</h1>

            <div className="mt-10 px-5">
                <div>{page?.content[language] && parse(page?.content[language])}</div>
            </div>
        </div>
    );
}

export default InfoPage;
