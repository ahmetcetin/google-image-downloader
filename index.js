const fs = require('fs');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const mkdirp = require('mkdirp');
const request = require('superagent');
const md5 = require('md5');
const Scraper = require('./scraper');

const main = async () => {
  clear();
  console.log(chalk.yellow(figlet.textSync('Google DL', { horizontalLayout: 'full' })));

  try {
    const { query, baseFolder, qtty } = await inquirer.prompt([
      { type: 'input', name: 'query', message: 'Search term?' },
      {
        type: 'input',
        name: 'baseFolder',
        message: 'Base directory to download to?',
        default: './downloads',
      },
      {
        type: 'input',
        name: 'qtty',
        message: 'How many pictures?',
        default: () => 200,
        validate: (val) => Number.isInteger(+val),
      },
    ]);

    const { folder, domain, ...tbs } = await inquirer.prompt([
      { type: 'input', name: 'folder', message: 'Sub-folder name?', default: query },
      {
        type: 'list',
        name: 'domain',
        message: 'Which language?',
        choices: [
          'English',
          'German',
          'French',
          'Spanish',
          'Italian',
          'Indian',
          'Polish',
          'Romanian',
          'Turkish',
        ],
        filter: (val) => {
          switch (val) {
            case 'English':
              return 'com';
            case 'German':
              return 'de';
            case 'French':
              return 'fr';
            case 'Spanish':
              return 'es';
            case 'Italian':
              return 'it';
            case 'Indian':
              return 'co.in';
            case 'Polish':
              return 'pl';
            case 'Romanian':
              return 'ro';
            case 'Turkish':
              return 'com.tr';
          }
        },
      },
      {
        type: 'list',
        name: 'isz',
        message: 'Which size?',
        choices: ['large', 'medium'],
        filter: (val) => val[0],
      },
      {
        type: 'list',
        name: 'itp',
        message: 'What type?',
        choices: ['photo', 'clipart', 'lineart', 'face'],
      },
      {
        type: 'list',
        name: 'ic',
        message: 'Color type?',
        choices: ['color', 'gray'], // 'trans'],
      },
    ]);

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `Start downloading ${qtty} ${query} images from google.${domain}. Ok?`,
        default: true,
      },
    ]);

    if (!confirmed) {
      console.log(chalk.red('Cancelled!'));
      process.exit(0);
    }

    const google = new Scraper({
      puppeteer: {
        headless: false,
      },
      userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0',
      tbs,
    });

    const results = await google.scrape(query.trim(), +qtty, domain);
    let processed = 0;
    let skipped = 0;

    if (results.length > 0) {
      console.log(chalk.green(`${results.length} results found, downloading jpg files...`));
      let path = `${baseFolder}`;
      if (!!folder.trim()) path = `${path}/${folder.trim()}`;
      await mkdirp(path);

      for (let result of results) {
        const ext = result.url.split('.').pop();
        if (ext === 'jpg' || ext === 'jpeg') {
          const filename = md5(result.url) + '.jpg';
          const ws = fs.createWriteStream(`${path}/${filename}`);
          ws.on('error', (err) => {
            console.log(chalk.red(err.message));
            process.exit(1);
          });
          ws.on('finish', () => {
            console.log(chalk.blue(`Downloaded from ${result.url}`));
            processed += 1;
            if (processed === +qtty) {
              console.log(chalk.green(`All done! ${processed - skipped} files downloaded.`));
              if (skipped > 0)
                console.log(chalk.yellow(`Skipped ${skipped} files (non-jpeg images).`));
            }
          });
          const req = request(result.url);
          req.pipe(ws);
        } else {
          processed += 1;
          skipped += 1;
        }
      }
    } else {
      console.log(chalk.red('Nothing found.'));
    }
  } catch (e) {
    if (e.isTtyError) {
      console.log(chalk.red('Unsupported terminal.'));
    } else {
      console.log(e);
    }
  }
};

module.exports = main;
