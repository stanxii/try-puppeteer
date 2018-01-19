async function runCode(code) {
  const form = new FormData();
  form.append('file', new Blob([code], {type: 'text/javascript'}));
  const resp = await fetch('http://localhost:8080/run', {method: 'POST', body: form});
  return await resp.json();
}

const code = `
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log(await page.content());
  browser.close();
`;

runCode(code).then(result => {
  if (result.errors) {
    console.error(result.errors);
  }
  console.log(result.log);
});
