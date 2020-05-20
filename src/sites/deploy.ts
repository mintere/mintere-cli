import FormData from "form-data";
import fetch from "node-fetch";

interface DeploymentData {
  uid: string;
  environment: string;
  status: string;
}

interface ServerDeploymentResponse {
  deployment: DeploymentData;
  upload: {
    url: string;
    fields: Record<string, string>;
  };
}

export default async function deploy({
  stream,
  uploadUrl,
  deploymentKey,
  environment = "staging"
}: {
  stream: NodeJS.ReadableStream;
  uploadUrl: string;
  deploymentKey: string;
  environment: string;
}): Promise<DeploymentData> {
  let formData = new FormData();

  formData.append("environment", environment);

  formData.append("file", stream);

  console.log(`Uploading (environment: ${environment})...`);

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
    redirect: "follow",
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${deploymentKey}`,
      Accept: "application/json"
    }
  });

  if (res.ok) {
    const { deployment }: ServerDeploymentResponse = await res.json();
    console.log(`Deployment ${deployment.uid} uploaded`);
    return deployment;
  } else {
    console.error(await res.text());
    throw new Error("Upload failed");
  }
}
