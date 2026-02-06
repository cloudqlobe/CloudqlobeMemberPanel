import { useState, useEffect } from "react";
import Layout from "../../layout/page";
import axiosInstance from "../../../utils/axiosinstance";

const DATA_MODEL = {
  countryCode: "",
  country: "",
  qualityDescription: "",
  status: "Inactive",
  profile: "",
  rate: "",
  category: "",
  testStatus: "as",
  specialRate: false,
  addToTicker: false,
};

const Modal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [newLead, setNewLead] = useState(initialData || DATA_MODEL);

  useEffect(() => {
    setNewLead(initialData || DATA_MODEL);
  }, [initialData]);

  const handleAddLead = (e) => {
    e.preventDefault();
    onSubmit(newLead);
    setNewLead(DATA_MODEL);
  };

  if (!isOpen) return null;


  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h3 className='text-lg font-semibold mb-4'>
          {initialData ? "Update Rate" : "Add New Rate"}
        </h3>
        <form onSubmit={handleAddLead}>
          <input
            type='text'
            placeholder='Country Code'
            value={newLead.countryCode}
            onChange={(e) =>
              setNewLead({ ...newLead, countryCode: e.target.value })
            }
            className='mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg'
            required
          />
          <input
            type='text'
            placeholder='Country'
            value={newLead.country}
            onChange={(e) =>
              setNewLead({ ...newLead, country: e.target.value })
            }
            className='mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg'
            required
          />
          <input
            type='text'
            placeholder='Quality Description'
            value={newLead.qualityDescription}
            onChange={(e) =>
              setNewLead({ ...newLead, qualityDescription: e.target.value })
            }
            className='mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg'
            required
          />
          <select
            value={newLead?.profile || ""}
            onChange={(e) =>
              setNewLead({ ...newLead, profile: e.target.value })
            }
            className='mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg'>
            <option value='' disabled>
              Select Profile
            </option>
            <option value='Outbound'>Outbound</option>
            <option value='IVR'>IVR</option>
          </select>

          <input
            type='number'
            placeholder='Enter Rate'
            value={newLead?.rate || ""}
            onChange={(e) => setNewLead({ ...newLead, rate: e.target.value })}
            className='mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg'
          />
          <label className='flex items-center mb-4'>
            <input
              type='checkbox'
              checked={newLead.specialRate}
              onChange={(e) =>
                setNewLead({ ...newLead, specialRate: e.target.checked })
              }
              className='mr-2'
            />
            Special Rate
          </label>
          <label className='flex items-center mb-4'>
            <span className='mr-2'>Status:</span>
            <select
              value={newLead.status}
              onChange={(e) =>
                setNewLead({ ...newLead, status: e.target.value })
              }
              className='border border-gray-300 rounded-lg px-2 py-1'>
              <option value='Active'>Active</option>
              <option value='Inactive'>Inactive</option>
            </select>
          </label>
          <label className='flex items-center mb-4'>
            <input
              type='checkbox'
              checked={newLead.addToTicker}
              onChange={(e) =>
                setNewLead({ ...newLead, addToTicker: e.target.checked })
              }
              className='mr-2'
            />
            Add to Ticker
          </label>
          <div className='flex justify-between mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200'>
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200'>
              {initialData ? "Update Rate" : "Add Rate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RatesPage = () => {
  const [rateData, setRateData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("country");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axiosInstance.get("api/admin/ccrates");
        setRateData(response.data.ccrates);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };
    fetchRates();
  }, []);

  const handleAddLead = async (ccrates) => {

    try {
      if (isUpdateMode) {
        await axiosInstance.put(`api/admin/ccrates/${currentRate._id}`, ccrates);
      } else {
        await axiosInstance.post("api/admin/ccrates", ccrates);
      }
      setSuccessMessage(
        isUpdateMode ? "Rate updated successfully!" : "Rate added successfully!"
      );
      window.location.reload();
      setErrorMessage("");
      setModalOpen(false);
      setIsUpdateMode(false);
      setCurrentRate(null);
    } catch (error) {
      console.error("Error adding/updating rate:", error);
      setErrorMessage("Failed to add/update rate. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <Layout>
      <div className='container mx-auto px-4 py-4'>
        <h1 style={{ marginBottom: "15px" }} className='text-2xl font-semibold'>Rates Management</h1>
        {successMessage && (
          <p className='text-green-600 mt-4'>{successMessage}</p>
        )}
        {errorMessage && <p className='text-red-600 mt-4'>{errorMessage}</p>}

        <div className='mt-4'>
          <input
            type='text'
            placeholder='Search by Country or Profile'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 px-4 py-2'
            style={{ marginRight: "15px", width: "300px" }}
          />
          <span>
            <select
              style={{ height: "41px", marginRight: "15px", width: "190px" }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className='border border-gray-300 px-4 py-2'>
              <option value=''>Select Country</option>
              {rateData.map((rate) => (
                <option key={rate._id} value={rate.country}>
                  {rate.country}
                </option>
              ))}
            </select>

            <select
              style={{ height: "41px", marginRight: "15px", width: "190px" }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className='border border-gray-300 px-4 py-2'>
              <option value='country'>Sort by Country</option>
              <option value='rate'>Sort by Rate</option>
              <option value='status'>Sort by Status</option>
            </select>

            <select
              style={{ height: "41px", marginRight: "15px", width: "190px" }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='border border-gray-300 px-4 py-2'>
              <option value=''>Select Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </span>
        </div>

        <table className='min-w-full bg-white shadow-lg mt-4' >
          <thead>
            <tr className='bg-[#005F73] text-white'>
              <th className='py-2 px-4'>Country Code</th>
              <th className='py-2 px-4'>Country</th>
              <th className='py-2 px-4'>Quality Description</th>
              <th className='py-2 px-4'>Rate</th>
              <th className='py-2 px-4'>Status</th>
              <th className='py-2 px-4'>Profile</th>
            </tr>
          </thead>
          <tbody>
            {rateData
              .filter((rate) => {
                if (!rate) return false;

                // ❌ Exclude archived rows
                if (rate.status?.toLowerCase() === "archive") return false;

                const searchTerm = search.toLowerCase();
                return (
                  (rate.country?.toLowerCase().includes(searchTerm)) ||
                  (rate.profile?.toLowerCase().includes(searchTerm))
                );
              })
              .filter((rate) =>
                (selectedCountry ? rate.country === selectedCountry : true) &&
                (selectedStatus ? rate?.status?.toLowerCase() === selectedStatus?.toLowerCase() : true)
              )
              .sort((a, b) => {
                if (sort === "country") return a.country.localeCompare(b.country);
                if (sort === "rate") return a.rate - b.rate;
                if (sort === "status") return a.status.localeCompare(b.status);
                return 0;
              })
              .map((rate, index) => (
                <tr
                  key={rate._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <td className='py-2 px-4'>{rate.countryCode}</td>
                  <td className='py-2 px-4'>{rate.country}</td>
                  <td className='py-2 px-4'>{rate.qualityDescription}</td>
                  <td className='py-2 px-4'>{rate.rate}</td>
                  <td className='py-2 px-4'>{rate.status}</td>
                  <td className='py-2 px-4'>{rate.profile}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddLead}
        initialData={currentRate}
      />
    </Layout>
  );
};

export default RatesPage;