// MARK: Original code
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddJobPage = () => {
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("Full-Time");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [salary, setSalary] = useState(4500);
//   const [companyName, setCompanyName] = useState("");
//   const [contactEmail, setContactEmail] = useState("");
//   const [contactPhone, setContactPhone] = useState("");

//   const navigate = useNavigate();

//   const submitForm = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:4000/api/jobs", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         title,
//         type,
//         description,
//         company: {
//           name: companyName,
//           contactEmail,
//           contactPhone,
//         },
//         location,
//         salary,
//       }),
//     });
//     if (!res.ok) {
//       console.error(`Request error: Status code ${res.status}`);
//       return;
//     }
//     setTitle("");
//     setType("Full-Time");
//     setLocation("");
//     setDescription("");
//     setSalary(4500);
//     setCompanyName("");
//     setContactEmail("");
//     setContactPhone("");
//     navigate("/");
//   };

//   return (
//     <div className="create">
//       <h2>Add a New Job</h2>
//       <form onSubmit={submitForm}>
//         <label htmlFor="title">Job title:</label>
//         <input
//           id="title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <label htmlFor="type">Job type:</label>
//         <select
//           id="type"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="" disabled>
//             Select job type
//           </option>
//           <option value="Full-Time">Full-Time</option>
//           <option value="Part-Time">Part-Time</option>
//           <option value="Internship">Internship</option>
//         </select>
//         <label htmlFor="description">Job Description:</label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>
//         <label htmlFor="companyName">Company Name:</label>
//         <input
//           id="companyName"
//           type="text"
//           value={companyName}
//           onChange={(e) => setCompanyName(e.target.value)}
//         />
//         <label htmlFor="contactEmail">Contact Email:</label>
//         <input
//           id="contactEmail"
//           type="email"
//           value={contactEmail}
//           onChange={(e) => setContactEmail(e.target.value)}
//         />
//         <label htmlFor="contactPhone">Contact Phone:</label>
//         <input
//           id="contactPhone"
//           type="tel"
//           value={contactPhone}
//           onChange={(e) => setContactPhone(e.target.value)}
//         />
//         <label htmlFor="location">Location:</label>
//         <input
//           id="location"
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//         <label htmlFor="salary">Salary:</label>
//         <input
//           id="salary"
//           type="text"
//           value={salary}
//           onChange={(e) => setSalary(e.target.value)}
//         />
//         <button type="submit">Add Job</button>
//       </form>
//     </div>
//   );
// };

// export default AddJobPage;

// MARK: Coed optimized by Gemini
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const navigate = useNavigate();

  // 1. Unified State Object
  const [formData, setFormData] = useState({
    title: "",
    type: "Full-Time",
    location: "",
    description: "",
    salary: "4500", // Keep as string for input, parse on submit
    companyName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // 2. UI States for better UX
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Generic Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 4. Construct the payload to match backend expectations
    const newJob = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      location: formData.location,
      salary: formData.salary, // Ensure number type
      company: {
        name: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      },
    };

    try {
      const res = await fetch(`/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      // 6. Navigate on success (No need to manually reset state)
      navigate("/");
    } catch (err) {
      console.error("Failed to add job:", err);
      setError("Failed to add job. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>

      {/* 7. Display Error if exists */}
      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <form onSubmit={submitForm}>
        <label htmlFor="title">Job title:</label>
        <input
          id="title"
          name="title" // Name attribute is now  for handleChange
          type="text"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="type">Job type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="description">Job Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="companyName">Company Name:</label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
        />

        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
        />

        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          id="contactPhone"
          name="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={handleChange}
        />

        <label htmlFor="location">Location:</label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="salary">Salary:</label>
        <input
          id="salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />

        {/* 8. Disable button while loading */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Job"}
        </button>
      </form>
    </div>
  );
};

export default AddJobPage;
