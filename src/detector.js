export function detectSensitive(text) {
  const rules = [
    { name: 'API Key', regex: /sk-[A-Za-z0-9]{32,}/ },
    { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i },
    { name: 'Private Key', regex: /-----BEGIN (RSA|DSA|EC)? PRIVATE KEY-----/i },
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/ }
  ];

  const findings = [];

  for (const rule of rules) {
    const match = text.match(rule.regex);
    if (match) {
      findings.push(rule.name);
      if (window.DEBUG_MODE) {
        console.log(`[DEBUG] Rule matched: ${rule.name}`);
        console.log(`[DEBUG] Matched value:`, match[0]);
        }
      } else if (window.DEBUG_MODE) {
        console.log(`[DEBUG] Rule not matched: ${rule.name}`);
      }
  }

  return findings;
}
