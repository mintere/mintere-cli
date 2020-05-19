import { Command, flags } from "@oclif/command";

import Koa from "koa";
import * as fs from "fs";
import { promisify } from "util";
import { join, sep, resolve } from "path";

import { compileHandlebars } from "@mintere/sites/dist/precompiler";

import {
  parseCompiledTemplate,
  PartialsMap,
  renderHandlebars,
} from "@mintere/sites";

import chokidar from "chokidar";

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

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

export default class Local extends Command {
  static description = "Preview a site locally";

  static examples = [`$ mintere sites:local`];

  static flags = {
    help: flags.help({ char: "h" }),
    mocksDir: flags.string({
      char: "m",
      description: "relative path to mocks directory",
      default: "./mocks",
      parse: (input) => resolve(input),
    }),
  };

  static args = [
    {
      name: "dir",
      required: false,
      description: "relative path to theme directory",
      parse: (input: string) => resolve(input),
      default: "./theme",
    },
  ];

  async loadMockData(mocksDir: string, uid: string): Promise<MockFileData> {
    let path = join(mocksDir, uid.replace("/", sep));

    if ((await stat(path)).isDirectory()) {
      path += "/index.json";
    } else {
      path += ".json";
    }

    const content = await readFile(path, { encoding: "utf-8" });
    return JSON.parse(content);
  }

  _templates: {
    blocks: PartialsMap;
    partials: PartialsMap;
    templates: PartialsMap;
  } = { blocks: {}, partials: {}, templates: {} };

  async compileTemplate(themePath: string, absPath: string): Promise<void> {
    const partialNamePattern = /^(partials|templates|blocks)\/(.+)\.(?:hbs|handlebars)$/i;
    const match = themePath.match(partialNamePattern);
    if (match) {
      const groupName = match[1] as "partials" | "templates" | "blocks";
      const partialName = match[2];

      this.log("Compiling " + groupName + ":", partialName);
      const { compiled } = await compileHandlebars(fs.createReadStream(absPath));
      const template = parseCompiledTemplate(compiled);
      this.log("Compiled " + groupName + ":", partialName);

      this._templates[groupName][partialName] = template;
    } else {
      this.log("Ignoring becuase not a template", absPath);
    }
  }

  removeTemplate(path: string) {
    const partialNamePattern = /(partials|templates|blocks)\/(.+)\.(?:hbs|handlebars)$/i;
    const match = path.match(partialNamePattern);
    if (match) {
      const groupName = match[1] as "partials" | "templates" | "blocks";
      const partialName = match[2];

      delete this._templates[groupName][partialName];

      this.log("Removing " + groupName + ":", partialName);
    } else {
      this.log("Ignoring becuase not a template", path);
    }
  }

  async run() {
    const {
      args: { dir },
      flags: { mocksDir }
    } = this.parse(Local);

    let templatesCompiling: Promise<void>[] = [];

    await new Promise((res, rej) => {
      chokidar
        .watch(["./partials/**.hbs", "./templates/**.hbs", "./blocks/**.hbs"], {cwd: dir})
        .on("add", (path) =>
          templatesCompiling.push(this.compileTemplate(path, resolve(dir, path)))
        )
        .on("change", (path) =>
          templatesCompiling.push(this.compileTemplate(path, resolve(dir, path)))
        )
        .on("unlink", (path) => this.removeTemplate(path))
        .on("ready", () => res(Promise.all(templatesCompiling)))
        .on("error", rej);
    });

    const app = new Koa();

    app.use(async (ctx) => {
      if (ctx.path.startsWith("/_mintere/")) {
        ctx.status = 404;
        ctx.body = "Not found.";
      } else if (ctx.path.startsWith("/assets/")) {
        if (ctx.path.endsWith(".css")) ctx.set("Content-Type", "text/css");
        ctx.body = fs.createReadStream(join(dir, ctx.path));
      } else {
        const data = await this.loadMockData(mocksDir, ctx.path);

        const template = this._templates.templates[data.templateUid];

        ctx.body = await renderHandlebars(
          Promise.resolve(template),
          Promise.resolve(this._templates.partials),
          data.renderData,
          {
            environment: "local",
            recaptchaV3PublicKey: "",
            formSubmissionUrl: "/_mintere/local-form",
          },
          {
            assetUrl(path) {
              return "/assets/" + path;
            },
            retrieveBlock: async (name) => {
              return this._templates.blocks[name];
            },
            formsScriptSource: () => "/_mintere/forms.js",
          }
        );
      }
    });

    const PORT = 4200;
    app.listen(PORT, () => {
      console.log(`🚀 Sites Server listening on http://0.0.0.0:${PORT}`);
    });
  }
}
