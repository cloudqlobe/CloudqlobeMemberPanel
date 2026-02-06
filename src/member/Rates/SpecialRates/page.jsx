import React, { useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { ToastContainer } from 'react-toastify';
import axiosInstance from '../../../utils/axiosinstance';

const SpecialRatePage = () => {
    const [specialRates, setSpecialRates] = useState([]);

    useEffect(() => {
        const fetchCustomerAndRates = async () => {
            try {
                const ratesResponse = await axiosInstance.get("api/admin/ccrates");
                const specialRates = ratesResponse.data.ccrates.filter(rate => rate.specialRate === 1);
                setSpecialRates(specialRates);

            } catch (error) {
                console.error("Error fetching customer or rates:", error);
            }
        };

        fetchCustomerAndRates();

    }, []);

    return (
        <Layout>
            <div className="p-6 text-gray-900">
                <h2 className="text-xl font-bold flex items-center" >
                    {/* <FaStar className="text-yellow-500 mr-2" /> */}
                    SPECIAL RATES
                </h2>
                {/* Special Rates Table */}
                <div className="mt-6 overflow-x-auto" style={{width:"95vw"}}>
                    <table className="min-w-full border-collapse">
                        <thead className="bg-[#005F73] text-white text-left">
                            <tr>
                                <th className="p-2">Country Code</th>
                                <th className="p-2">Country</th>
                                <th className="p-2 ">Quality Description</th>
                                <th className="p-2">Rate</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specialRates.map((rate, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}  // Alternating colors
                                >
                                    <td className="p-2">{rate.countryCode}</td>
                                    <td className="p-2">{rate.country}</td>
                                    <td className="p-2">{rate.qualityDescription}</td>
                                    <td className="p-2">${rate.rate}</td>
                                    <td className="p-2">
                                        <span className={`text-${rate.status === 'Active' ? 'green' : 'red'}-600`}>
                                            {rate.status}
                                        </span>
                                    </td>
                                    <td className="p-2">{rate.profile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default SpecialRatePage;