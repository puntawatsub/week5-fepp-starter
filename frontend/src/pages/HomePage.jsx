// import { useEffect, useState } from "react";
// import JobListing from "../components/JobListing";

// const Home = () => {
//   const [jobs, setJobs] = useState([]);
//   const [jobType, setJobType] = useState("");

//   useEffect(() => {
//     fetch(jobType !== "" ? `/api/jobs/type/${jobType}` : "/api/jobs")
//       .then(async (res) => {
//         if (!res.ok) {
//           throw new Error(`Response Status: ${res.status}`);
//         }
//         const data = await res.json();
//         setJobs(data);
//       })
//       .catch((error) => {
//         setJobs([]);
//         console.error("Error fetching jobs:", error);
//       });
//   }, [jobType]);

//   return (
//     <div className="home">
//       Filtered by:
//       <select
//         value={jobType}
//         onChange={(e) => setJobType(e.target.value)}
//         style={{ marginBottom: "1rem", marginLeft: ".5rem" }}
//       >
//         <option value="">None</option>
//         <option value="Full-time">Full-time</option>
//         <option value="Part-time">Part-time</option>
//         <option value="Internship">Internship</option>
//       </select>
//       <div className="job-list">
//         {jobs.length === 0 && <p>No jobs found</p>}
//         {jobs.length !== 0 &&
//           jobs.map((job) => <JobListing key={job.id} {...job} />)}
//       </div>
//     </div>
//   );
// };

// export default Home;

// MARK: AI Code to handle network race condition

import { useEffect, useState } from "react";
import JobListing from "../components/JobListing";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("");

  // UI States for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Create an AbortController to cancel stale requests
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Construct URL
        const url = jobType ? `/api/jobs/type/${jobType}` : "/api/jobs";

        const res = await fetch(url, { signal });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        // 2. Ignore errors caused by cancelling the fetch
        if (err.name !== "AbortError") {
          console.error("Error fetching jobs:", err);
          setError("Failed to load jobs. Please try again.");
          setJobs([]);
        }
      } finally {
        // Only turn off loading if we weren't aborted
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchJobs();

    // 3. Cleanup function runs when component unmounts or jobType changes
    return () => controller.abort();
  }, [jobType]);

  return (
    <div className="home">
      <div className="filter-container">
        <label htmlFor="job-type-select">Filtered by:</label>
        <select
          id="job-type-select"
          className="job-select" // Moved styles to CSS
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Jobs</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="job-list">
        {/* 4. Handle Loading, Error, and Empty States explicitly */}
        {isLoading && <p className="loading-msg">Loading opportunities...</p>}

        {error && <p className="error-msg">{error}</p>}

        {!isLoading && !error && jobs.length === 0 && (
          <p>No jobs found for this category.</p>
        )}

        {!isLoading &&
          !error &&
          jobs.map((job) => <JobListing key={job.id} {...job} />)}
      </div>
    </div>
  );
};

export default Home;
