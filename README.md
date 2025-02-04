## Running Node.js scripts on Apillon Cloud Functions

The provided TypeScript code snippet is a template for deploying a script to the [Acurast network](https://acurast.com/) through [Apillon](https://apillon.io/). This script is designed to establish a WebSocket connection to Acurast's decentralized network, which is essential for enabling communication between your script and the Acurast processors. Here's a breakdown of how this template works and how it fits into the deployment process:

### Code Explanation

```typescript:index.ts
declare const _STD_: any;

_STD_.ws.open(
  [
    "wss://websocket-proxy-1.prod.gke.acurast.com/",
    "wss://websocket-proxy-2.prod.gke.acurast.com/",
  ],
  () => {
    // Success callback: Code to execute when the WebSocket connection is successfully opened
  },
  (error) => {
    // Error callback: Code to handle any errors that occur while opening the WebSocket connection
  }
);
```

The request body should contain all the data you wish to send to the cloud function before it is executed.

Example request body:
`HTTP POST`
```json
{
  "method": "buckets"
}
```

This template and deployment process allow you to leverage Acurast's decentralized infrastructure for running your Node.js scripts, ensuring they are accessible and callable through the Apillon gateway. For more detailed runtime environment documentation, you can refer to the [Acurast Developer Docs](https://docs.acurast.com/developers/deployment-runtime-environment).

- **`_STD_` Object**: This is a special object provided by the Acurast runtime environment. It exposes various functionalities, including WebSocket operations, environment variable access, and more.

- **WebSocket Connection**: The `ws.open` method is used to establish a connection to the Acurast network. The URLs provided are endpoints for the WebSocket proxies that facilitate communication with the network.

- **Callbacks**: The code includes placeholders for success and error callbacks. You can define what actions to take when the connection is successfully established or if an error occurs.

### Received Object Structure

When a JSON payload is sent to this job, the received object has the following structure:
```typescript
{
  body: object;
  headers: Record<string, string>;
  path: string;
  queryStringParameters: Record<string, string>;
  multiValueQueryStringParameters: { [name: string]: string[]; };
  pathParameters: Record<string, string>;
}
```

- **`body`**: This property contains the parsed JSON payload from the request. The `safeJsonParse` function is used to safely parse the `event.body`, falling back to the raw `event.body` if parsing fails.
- **`headers`**: This object includes all the HTTP headers sent with the request. Headers can be used for authentication, content type specification, and more.
- **`path`**: This string represents the path of the request URL. It can be used to determine the specific endpoint that was called.
- **`queryStringParameters`**: This object contains key-value pairs of query string parameters from the request URL. These parameters are typically used to pass additional data to the server.
- **`multiValueQueryStringParameters`**: Similar to `queryStringParameters`, but allows for multiple values per key. This is useful when a query parameter can have multiple values.
- **`pathParameters`**: This object holds any parameters that are part of the URL path. These are often used in RESTful APIs to identify resources.

### Deployment Process

1. **Edit the Script**: You can modify the `index.ts` file and add additional files or folders as needed for your application logic.

2. **Environment Variables**: Access environment variables using `_STD_.env["APILLON_API_KEY"]`. This is crucial for securely managing sensitive information like API keys. You can modify the environment variables through the [Apillon developer console](https://app.apillon.io/dashboard/service/cloud-functions/).

3. **Build the Script**:
   - Run `npm run i` to install dependencies.
   - Run `npm run build` to compile the TypeScript code into a JavaScript bundle (`index.bundle.js`).

4. **Deploy the Script**:
   - **Via Apillon Dashboard**: Upload the `index.bundle.js` file to the Apillon dashboard at [Apillon Cloud Functions](https://app.apillon.io/dashboard/service/cloud-functions/).
   - **Via API**: Alternatively, you can deploy the script using the Apillon API. Documentation for this process is available at [Apillon Web3 Cloud Functions](https://wiki-staging.apillon.io/web3-services/8-web3-cloud-functions.html) and [Apillon Cloud Functions API](https://wiki-staging.apillon.io/build/11-cloud-functions-api.html).
   - **Via SDK**: You can also deploy and manage cloud functions using the Apillon SDK. Documentation for this process is available at [Apillon SDK](https://wiki-staging.apillon.io/build/5-apillon-sdk.html#cloud-functions).
   - **Via CLI**: You can also deploy the script using the Apillon CLI. Documentation for this process is available at [Apillon CLI](https://wiki-staging.apillon.io/build/6-apillon-cli.html#cloud-function-commands).

5. **Obtain Execution Endpoint**: After deploying, wait a few minutes. You will obtain the callable endpoint to execute the job on the Apillon dashboard.

### Executing the Cloud Function

Once your cloud function is deployed and running, Apillon provides you with a gateway URL that you are able to call via an HTTP POST request. The URL can be found on the [Apillon developer console](https://app.apillon.io/dashboard/service/cloud-functions/) when opening a specific cloud function, or by using the [Cloud Functions API](https://wiki.apillon.io/build/11-cloud-functions-api.md).

### File Descriptions

- **`handler.ts`**: This file contains the main function used for development. It simulates the function handler that will be executed in the cloud environment. This allows for local development and testing of the function's logic before deployment.

- **`handler.spec.ts`**: This file is used to test the `handlePayload` function with various test cases. It ensures that the function behaves as expected under different scenarios, providing confidence in the code's reliability.

- **`index.ts`**: This file serves as a boilerplate wrapper for the cloud function. It contains the code that gets hosted on the cloud environment. After building the project, this file is compiled into `index.bundle.js`, which is the actual file deployed to the cloud.

### Testing Locally

To test the functionality of your handler locally, you can run the following command:

```
npm run test
```

This command will execute the tests defined in `handler.spec.ts`, allowing you to verify that the `handlePayload` function works correctly with the provided test cases.