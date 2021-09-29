// @ts-nocheck
const { promises, existsSync, mkdirSync } = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');

require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const distDir = path.join(process.cwd(), 'src', 'i18n');

const clearDist = async () => {
  try {
    const files = await promises.readdir(distDir);

    files.forEach(async (file) => {
      await promises.unlink(path.join(distDir, file));
    });
  } catch (err) {
    console.error(err);
  }
};

const writeLangFile = async (key, value) => {
  const fileContent = `/* eslint-disable */\nexport default ${value}`;

  try {
    await promises.writeFile(path.join(distDir, key), fileContent, 'utf8');
  } catch (e) {
    console.error('что то пошло не так с сохраненим файла переводов', key);
  }
};

const normalizeText = (t) => t
  .trim()
  .replace(/\n/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();


const generateFiles = async (messages) => {
   // check if folder is exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir);
  }

  await clearDist();
  
  const langs = Object.keys(messages)
  const filesNames = langs.map((lang) => `${lang}.js`);

  await Promise.all(
    filesNames.map((key, i) => {
      const lang = langs[i];
      const currentMessages = messages[lang];
      const stringifiedMessages = JSON.stringify(currentMessages);

      return writeLangFile(key, stringifiedMessages);
    }),
  );
};

(async function() {
  try {

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    await doc.useApiKey(process.env.GOOGLE_SHEETS_API_KEY);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    
    
    const rows = await sheet.getRows();
  
    const { headerValues } = sheet;
    const langs = headerValues.splice(1);

    const messages = {};

    langs.forEach((l) => {
      messages[l] = {};
    });

    rows.forEach((row) => {
      langs.forEach((lang) => {
        const value = row[lang];
        messages[lang][row.key] = normalizeText(value)
      });
    });

    await generateFiles(messages)
  } catch (err) {
    console.error(err);
  }
}());

