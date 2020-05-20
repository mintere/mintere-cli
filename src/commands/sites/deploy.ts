import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import { resolve, join } from "path";
import * as tarFs from "tar-fs";

import deploy from "../../sites/deploy"

interface MockFileData {
  templateUid: string;
  renderData: {
    title: string;
    uid: string;
    metaDescription: string;
    settings: any;
    blocks: any;
  };
}

export default class Deploy extends Command {
  static description = "Deploy a site to the Mintere Sites Platform";

  static examples = [`$ DEPLOYMENT_KEY=key mintere sites:deploy`];

  static flags = {
    help: flags.help({ char: "h" }),
    environment: flags.string({
      char: "e",
      description: "the environment to deploy to",
      default: "production",
    }),
    api: flags.string({
      default: "https://app.mintere.com",
      //hidden: true,
      description: "The base URL of the API to deploy to.",
    }),
    deploymentKey: flags.string({
      char: "k",
      required: true,
      env: "DEPLOYMENT_KEY",
      description: "The key to use when deploying to the API.",
    }),
  };

  static args = [
    {
      name: "dir",
      default: "./theme",
      description: "The directory of the theme to deploy",
      parse: (input: string) => resolve(input),
    },
  ];

  async run() {
    const {
      args: { dir },
      flags: { environment, api, deploymentKey },
    } = this.parse(Deploy);

    const tmpDir = resolve("./tmp");
    if(!fs.existsSync(tmpDir)) fs.mkdirSync("tmp");
    const tmpFile = join(tmpDir, "mintere-deploy.tar");

    try {
      const writeFs = fs.createWriteStream(tmpFile);
  
      tarFs
        .pack(dir, {
          ignore(name: string) {
            const regexp = /(\/|^).DS_Store$/;
            return !!name.match(regexp);
          },
        })
        .pipe(writeFs);
  
      await new Promise((res) => {
        writeFs.on("close", res);
      });
  
      const stream = fs.createReadStream(tmpFile);

      await deploy({
        stream,
        uploadUrl: api + "/deployments",
        deploymentKey,
        environment,
      });
    } catch (e) {
      if (typeof e.status === "string")
        console.error("Error status: ", e.status);
      else console.error(e);
      process.exit(1);
    } finally {
      fs.unlinkSync(tmpFile);
    }
  }
}
