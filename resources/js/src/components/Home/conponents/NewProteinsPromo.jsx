import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";

import "./NewProteinPromo.css";
import { getCategoryData } from "../../../services/productService";
import ProductModal from "../../ProductModal/ProductModal";
import { useTranslation } from "react-i18next";
import Loader from "../../utils/Loader";

const NewProteinsPromo = () => {

    const [ proteins, setProteins ] = useState([]);
    const [ modalHandler, setModalHandler ] = useState(false);
    const [ selectedProduct, setSelectedProduct ] = useState({});
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);


    const { t } = useTranslation();

    // useEffect(() => {
    //     getCategoryData('proteini')
    //         .then((result) => setProteins(result.products))
    //         .catch((error) => console.log(error));
    // },[])

    const modalView = () => {
        setModalHandler(pred => !pred);
    }

    return (
        <div className='container mx-auto pt-10 lg:p-10 min-h-[calc(50vh-109px)] lg:min-h-[calc(100vh-109px)]'>
            {/* <h1 className='text-center text-2xl xl:text-5xl font-bold underline underline-offset-8 text-white uppercase'>{t('New Proteins')}</h1> */}
            
            <div className="relative flex flex-col md:flex-row gap-10 mx-2 lg:mt-20 justify-between items-start min-h-[calc(80vh-109px)]">
                {/* {loading && ( <Loader /> )} */}
                <div className="relative cursor-pointer hover:scale-105 hover:z-30 flex items-start" onClick={() => (setModalHandler(true), setVisible(true), setSelectedProduct(proteins[0]))}>
                    <img
                        style={{ display: loading ? 'none' : 'block' }}
                        className="scale-100 sm:scale-75"
                        src={`/storage/${proteins[0]?.image}`}
                        alt="Protein"
                        onLoad={() => setLoading(false)}
                    />
                </div>

                <div className="relative cursor-pointer hover:scale-105" onClick={() => (setModalHandler(true), setVisible(true), setSelectedProduct(proteins[1]))}>
                    <img
                        style={{ display: loading ? 'none' : 'block' }}
                        className="scale-100 sm:scale-75 lg:scale-100"
                        src={`/storage/${proteins[1]?.image}`}
                        alt="Protein"
                        onLoad={() => setLoading(false)}
                    />
                </div>

                <div className="relative cursor-pointer hover:scale-105" onClick={() => (setModalHandler(true), setVisible(true), setSelectedProduct(proteins[2]))}>
                    <img
                        style={{ display: loading ? 'none' : 'block' }}
                        className="scale-100 sm:scale-75"
                        src={`/storage/${proteins[2]?.image}`}
                        alt="Protein"
                        onLoad={() => setLoading(false)}
                    />
                </div>
            </div>
            {modalHandler && (
                <Dialog
                    visible={visible}
                    onHide={() => {
                        if (!visible) return;
                        setVisible(false);
                    }}
                >
                    <ProductModal productData={selectedProduct} modalHandler={modalView} />
                </Dialog>
            )}
        </div>
    )
}

export default NewProteinsPromo;