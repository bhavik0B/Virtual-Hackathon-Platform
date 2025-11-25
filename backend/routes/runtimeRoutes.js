const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { execPromise } = require("../utils/execPromise");
const net = require("net");

function isPortInUse(port) {
    return new Promise(resolve => {
        const server = net.createServer();
        server.once("error", () => resolve(true));
        server.once("listening", () => {
            server.close();
            resolve(false);
        });
        server.listen(port);
    });
}


// Base directory for projects
const PROJECTS_BASE = path.join(__dirname, "..", "projects");

// Generic Flask Dockerfile
const dockerfileContent = `
FROM python:3.10

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5001
CMD ["python", "app.py"]
`;

// INSTALL DEPENDENCIES
router.post("/:teamName/install", async (req, res) => {
    const teamName = req.params.teamName;
    const projectDir = path.join(PROJECTS_BASE, teamName);

    if (!fs.existsSync(projectDir)) {
        return res.status(404).json({ error: "Project folder not found" });
    }

    try {
        // Write Dockerfile into the project folder
        fs.writeFileSync(path.join(projectDir, "Dockerfile"), dockerfileContent);

        // Build docker image
        await execPromise(`docker build -t ${teamName}-image ${projectDir}`);

        res.json({ message: "Dependencies installed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
    }
});

// RUN PROJECT
router.post("/:teamName/run", async (req, res) => {
    const teamName = req.params.teamName;

    try {
        // Stop old container (if exists)
        await execPromise(`docker rm -f ${teamName}-container || true`);

        let hostPort = 5000;
        while (await isPortInUse(hostPort)) {
            hostPort++;
        }

        // Run the container
        await execPromise(
            `docker run -d --name ${teamName}-container -p ${hostPort}:${hostPort} ${teamName}-image`
        );

        res.json({
            message: `Project running at http://localhost:${hostPort}`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
    }
});

module.exports = router;
