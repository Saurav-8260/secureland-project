import { create } from "ipfs-http-client";

const projectId = "YOUR_PROJECT_ID";
const projectSecret = "YOUR_PROJECT_SECRET";

const auth =
  "Basic " + btoa(projectId + ":" + projectSecret);

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export async function uploadToIPFS(file) {
  try {
    const added = await client.add(file);

    return `https://ipfs.io/ipfs/${added.path}`;
  } catch (error) {
    console.log("IPFS upload error:", error);
  }
}