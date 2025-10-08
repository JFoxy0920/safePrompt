export function detectSensitive(text) {
  const rules = [
    { name: 'API Key', regex: /sk-[A-Za-z0-9]{32,}/g },
    { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
    { name: 'Private Key', regex: /-----BEGIN (RSA|DSA|EC)? PRIVATE KEY-----/g },
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  ];
  const findings = [];
  for (const rule of rules) {
    if (rule.regex.test(text)) {
      findings.push(rule.name);
    }
  }
  return findings;
}
