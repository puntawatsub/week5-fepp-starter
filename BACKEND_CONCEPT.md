## Virtual field in jobModel.js
    jobSchema.set("toJSON", {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            return ret;
        },
    });

- What this does and why it’s useful?
    - MongoDB and Mongoose use _id as the primary key field.
    - Many frontends expect an id  field instead of _id.
    - This configuration customizes how a jon document is converted to JSON:
        - virtuals: true tells Mongoose to include virtual field when converting a document to JSON.
        - transform: (doc, ret) => {...} lets modify the JSON representing right before its sent: 
            - ret.id 0 ret._id; :- It creates a new id property that copies the value of _id
            - return ret; :- returns the modified JSON object.
    - When your API sends a job to the frontend (e.g. from res.json(job)), the JSON will contain both _id and id, and the React app can safely use job.id without knowing anything about MongoDB’s _id naming. This keeps frontend code simpler and more consistent with typical REST API conventions.

## CORS middleware in backend/app.js
    const cors = require("cors");
    // Middlewares
    app.use(cors());
    app.use(express.json());

- What CORS is and why it’s needed?
    - Cross-Origin Resource Sharing known as CORS is a browser security mechanism that controls whether a web page from one origin is allowed to make a request to another origin.
    - There are different origin for frontend and backend so by default the browser would block requests from the frontend to backend.

    app.use(cors()):
        - Adds the appropriate HTTP headers to response from the Express API.
        - Also tells the browser that requests from the other origin  are allowed.
        - So CORS is necessary to let the React frontend and Node backend communicate safely while running on different ports during development.
## Proxy configuration in frontend/vite.config.js
    proxy: {
        "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        },
    },
- How this proxy works and what problem it solves?
    - The Vite dev server forwards requests from '/api/...' to 'http://localhost:4000/api/...'.
    - This hides the backend URL from the frontend code and avoids CORS issues in development.
    - Also keep fontend fetch calls simplesuch as ('fetch("/api/jobs")') while still talking to the Node backend.
