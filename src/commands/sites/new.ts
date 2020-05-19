import { Command, flags } from "@oclif/command";

var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();

env.register(require.resolve('generator-mintere/generators/site'), 'mintere:site');

export default class New extends Command {
  static description = "Create a new site";

  static examples = [`$ mintere sites:new`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    env.run("mintere:site")
  }
}
