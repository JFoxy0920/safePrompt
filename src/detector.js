export function detectSensitive(text) {
  const rules = [
    { name: 'API Key', regex: /sk-[A-Za-z0-9]{32,}/ },
    { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
    { name: 'Private Key', regex: /-----BEGIN (RSA|DSA|EC)? PRIVATE KEY-----/ },
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/ },
    { name: 'test', regex: /e/ }
  ];
  const findings = [];
  for (const rule of rules) {
    if (rule.regex.test(text)) {
      findings.push(rule.name);
    }
  }
  console.log("Testing text:", text);
  return findings;
}
