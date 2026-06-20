import retry from "async-retry";
import { prefix } from "../app";

async function waitForAllServices() {
  const fetchStatusPage = async () => {
    try {
      const appUrl = `${process.env.APP_HOST || "http://localhost"}:${process.env.PORT || 3000}${prefix}`,
        response = await fetch(appUrl);
      console.log(`Fetching status page: ${appUrl}`);

      if (!response.ok) throw Error(`HTTP Error ${response.status}`);

      console.log("Server running: ", appUrl);
      await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const waitForWebServer = async () => {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (err: Error, attempt: number) => {
        console.log(
          `Attempt ${attempt} - Failed to fetch status page: ${err.message}`,
        );
      },
    });
  };

  await waitForWebServer();
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
