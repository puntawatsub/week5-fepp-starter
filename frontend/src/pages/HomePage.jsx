import { useEffect, useState } from "react";
import JobListing from "../components/JobListing";

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/jobs")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Response Status: ${res.status}`);
        }
        const data = await res.json();
        setJobs(data);
      })
      .catch((error) => {
        setJobs([]);
        console.error("Error fetching jobs:", error);
      });
  }, []);
  return (
    <div className="home">
      <div className="job-list">
        {jobs.length === 0 && <p>No jobs found</p>}
        {jobs.length !== 0 &&
          jobs.map((job) => <JobListing key={job.id} {...job} />)}
      </div>
    </div>
  );
};

export default Home;
