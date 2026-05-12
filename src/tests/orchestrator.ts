import retry from "async-retry";

async function waitForAllServices() {
  const fetchStatusPage = async () => {
    try {
      const response = await fetch(`${process.env.HOST || 'http://localhost'}:${process.env.PORT || 3000}/`);
      if (!response.ok) throw Error(`HTTP Error ${response.status}`);
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
