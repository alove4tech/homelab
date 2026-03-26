export type Domain = {
  id: string;
  name: string;
  weight: string;
  description: string;
};

export type Flashcard = {
  id: number;
  domain: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  front: string;
  back: string;
};

export type Question = {
  id: number;
  domain: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type PbqScenario = {
  id: number;
  domain: string;
  topic: string;
  title: string;
  scenario: string;
  prompt: string;
  tasks: string[];
  solution: string[];
};

export const secPlusDomains: Domain[] = [
  {
    id: "general-security-concepts",
    name: "General Security Concepts",
    weight: "12%",
    description: "Core principles, security controls, resilience, and identity fundamentals.",
  },
  {
    id: "threats-vulnerabilities-mitigations",
    name: "Threats, Vulnerabilities, and Mitigations",
    weight: "22%",
    description: "Threat actors, attacks, weaknesses, social engineering, and defensive measures.",
  },
  {
    id: "security-architecture",
    name: "Security Architecture",
    weight: "18%",
    description: "Secure design across networks, systems, cloud, applications, and enterprise environments.",
  },
  {
    id: "security-operations",
    name: "Security Operations",
    weight: "28%",
    description: "Monitoring, response, hardening, recovery, scanning, logging, and operational defense.",
  },
  {
    id: "security-program-management-and-oversight",
    name: "Security Program Management and Oversight",
    weight: "20%",
    description: "Governance, risk, training, policy, compliance, and lifecycle management.",
  },
];

export const flashcards: Flashcard[] = [
  { id: 1, domain: "general-security-concepts", topic: "foundations", difficulty: "easy", front: "What does CIA stand for in cybersecurity?", back: "Confidentiality, Integrity, and Availability." },
  { id: 2, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "Authentication vs authorization", back: "Authentication verifies identity. Authorization determines access permissions." },
  { id: 3, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", front: "What is non-repudiation?", back: "Assurance that someone cannot credibly deny an action they performed." },
  { id: 4, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "What is multifactor authentication?", back: "Authentication using at least two different factor types, such as password plus authenticator app." },
  { id: 5, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "What is least privilege?", back: "Giving users and systems only the access required to perform their tasks." },
  { id: 6, domain: "general-security-concepts", topic: "governance", difficulty: "easy", front: "What is an acceptable use policy?", back: "A policy that defines how users are allowed to use company systems and resources." },
  { id: 7, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", front: "Phishing vs spear phishing", back: "Phishing is broad and mass-sent. Spear phishing is tailored to a specific target." },
  { id: 8, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "medium", front: "What is a zero-day vulnerability?", back: "A vulnerability with no vendor patch available at the time it is discovered or exploited." },
  { id: 9, domain: "threats-vulnerabilities-mitigations", topic: "physical-security", difficulty: "easy", front: "What is tailgating?", back: "An unauthorized person follows an authorized person into a restricted area." },
  { id: 10, domain: "threats-vulnerabilities-mitigations", topic: "identity-attacks", difficulty: "medium", front: "What is credential stuffing?", back: "Using leaked username/password pairs to try logging into other services." },
  { id: 11, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "hard", front: "What is a buffer overflow?", back: "When more data is written to memory than allocated, potentially causing crashes or code execution." },
  { id: 12, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "medium", front: "What is input validation used for?", back: "To ensure incoming data is safe and expected, helping prevent attacks such as injection." },
  { id: 13, domain: "security-architecture", topic: "network-security", difficulty: "easy", front: "What is network segmentation?", back: "Dividing a network into smaller zones to reduce lateral movement and improve control." },
  { id: 14, domain: "security-architecture", topic: "network-security", difficulty: "easy", front: "What does a firewall do?", back: "Filters traffic according to configured rules, allowing or blocking communications." },
  { id: 15, domain: "security-architecture", topic: "cryptography", difficulty: "medium", front: "Symmetric vs asymmetric encryption", back: "Symmetric uses one shared key. Asymmetric uses a public/private key pair." },
  { id: 16, domain: "security-architecture", topic: "network-security", difficulty: "medium", front: "What is a DMZ?", back: "A network segment that hosts externally accessible systems while isolating them from the internal network." },
  { id: 17, domain: "security-architecture", topic: "iam", difficulty: "easy", front: "What is single sign-on?", back: "An authentication approach that lets a user access multiple systems after signing in once." },
  { id: 18, domain: "security-architecture", topic: "data-protection", difficulty: "medium", front: "What is tokenization?", back: "Replacing sensitive data with a non-sensitive token that maps back to the original value." },
  { id: 19, domain: "security-operations", topic: "monitoring", difficulty: "easy", front: "What is a SIEM used for?", back: "Aggregating and analyzing logs and events to support detection and investigation." },
  { id: 20, domain: "security-operations", topic: "incident-response", difficulty: "easy", front: "Containment in incident response", back: "Actions taken to limit the spread and impact of an incident." },
  { id: 21, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", front: "Vulnerability scan vs penetration test", back: "Scans identify weaknesses automatically; penetration tests actively attempt exploitation." },
  { id: 22, domain: "security-operations", topic: "incident-response", difficulty: "easy", front: "What is eradication?", back: "The incident response phase focused on removing malware, persistence, or root cause." },
  { id: 23, domain: "security-operations", topic: "hardening", difficulty: "medium", front: "What is a baseline?", back: "A known-good configuration or performance reference used for comparison." },
  { id: 24, domain: "security-operations", topic: "incident-response", difficulty: "medium", front: "What is a playbook?", back: "A documented set of steps for responding to a recurring security event or incident." },
  { id: 25, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", front: "Purpose of security awareness training", back: "To reduce human risk by teaching users how to recognize and respond to threats." },
  { id: 26, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "easy", front: "Risk acceptance vs avoidance", back: "Acceptance means keeping a risk; avoidance means stopping the risky activity altogether." },
  { id: 27, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "medium", front: "What is due diligence?", back: "The ongoing effort to monitor and review security practices and decisions." },
  { id: 28, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", front: "Policy vs procedure", back: "Policy defines high-level intent; procedure gives step-by-step instructions." },
  { id: 29, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", front: "What is risk transfer?", back: "Shifting financial or operational impact to a third party, often through insurance or contracts." },
  { id: 30, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "easy", front: "What is data classification?", back: "Categorizing data by sensitivity and required protection level." },
  { id: 31, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", front: "What is the shared responsibility model?", back: "A cloud model where the provider secures some layers and the customer secures others depending on the service type." },
  { id: 32, domain: "security-operations", topic: "resilience", difficulty: "medium", front: "Recovery Time Objective (RTO)", back: "The target maximum time a system can be down before service is restored." },
  { id: 33, domain: "security-operations", topic: "resilience", difficulty: "medium", front: "Recovery Point Objective (RPO)", back: "The maximum acceptable amount of data loss measured in time." },
  { id: 34, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "easy", front: "Ransomware", back: "Malware that encrypts data or blocks access and demands payment for restoration." },
  { id: 35, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", front: "WPA3", back: "A modern wireless security standard with stronger protections than earlier WPA versions." },
  { id: 36, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", front: "What is an implicit deny?", back: "The default rule of denying access unless it is explicitly allowed." },
];

export const practiceQuestions: Question[] = [
  { id: 1, domain: "general-security-concepts", topic: "iam", difficulty: "easy", question: "A company requires employees to use a password and a time-based code from an authenticator app to access email. Which security concept is this implementing?", options: ["Federation", "Multifactor authentication", "Single sign-on", "Role-based access control"], answer: 1, explanation: "A password is one factor and an authenticator code is another, making this multifactor authentication." },
  { id: 2, domain: "general-security-concepts", topic: "controls", difficulty: "easy", question: "Which control type is primarily intended to discourage an attacker rather than directly stop them?", options: ["Deterrent", "Corrective", "Compensating", "Detective"], answer: 0, explanation: "Deterrent controls are intended to discourage unwanted behavior before it happens." },
  { id: 3, domain: "general-security-concepts", topic: "foundations", difficulty: "easy", question: "Which term describes the assurance that data has not been altered without authorization?", options: ["Availability", "Integrity", "Confidentiality", "Privacy"], answer: 1, explanation: "Integrity means information remains accurate and unmodified except by authorized changes." },
  { id: 4, domain: "general-security-concepts", topic: "iam", difficulty: "easy", question: "Which access control model assigns permissions based on job function?", options: ["RBAC", "MAC", "DAC", "ABAC"], answer: 0, explanation: "Role-Based Access Control assigns permissions according to a user's role or job function." },
  { id: 5, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", question: "An attacker sends an email crafted specifically for the finance manager and references a real vendor invoice. What type of attack is this?", options: ["Pharming", "Spear phishing", "Whaling", "Tailgating"], answer: 1, explanation: "The attack is targeted and personalized, which is characteristic of spear phishing." },
  { id: 6, domain: "threats-vulnerabilities-mitigations", topic: "network-security", difficulty: "medium", question: "Which mitigation best reduces the impact of a compromised user account moving laterally through a network?", options: ["Network segmentation", "Open guest Wi-Fi", "Disable logging", "Shared administrator accounts"], answer: 0, explanation: "Segmentation restricts access paths and limits lateral movement between systems and zones." },
  { id: 7, domain: "threats-vulnerabilities-mitigations", topic: "identity-attacks", difficulty: "medium", question: "What is the best description of credential stuffing?", options: ["Sending malicious USB drives", "Using leaked passwords across multiple sites", "Physically following a user into a building", "Flooding a system with ping requests"], answer: 1, explanation: "Credential stuffing uses stolen username/password pairs to attempt logins on different services." },
  { id: 8, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "medium", question: "A developer fails to sanitize user-supplied input in a web form. Which risk is increased the most?", options: ["SQL injection", "Shoulder surfing", "Tailgating", "Watering-hole attack"], answer: 0, explanation: "Improper input handling can allow injection attacks, including SQL injection." },
  { id: 9, domain: "security-architecture", topic: "network-security", difficulty: "easy", question: "Which technology is designed to inspect and filter traffic between internal and external networks based on configured rules?", options: ["Hypervisor", "Firewall", "Load balancer", "Proxy chain"], answer: 1, explanation: "Firewalls inspect and allow or block traffic based on rules and policy." },
  { id: 10, domain: "security-architecture", topic: "cryptography", difficulty: "medium", question: "Which encryption approach typically uses a public key to encrypt data and a private key to decrypt it?", options: ["Hashing", "Tokenization", "Asymmetric encryption", "Symmetric encryption"], answer: 2, explanation: "Asymmetric encryption uses a public/private key pair." },
  { id: 11, domain: "security-architecture", topic: "network-security", difficulty: "easy", question: "What is the main purpose of a DMZ?", options: ["To store backups offline", "To isolate public-facing systems from the internal network", "To replace firewalls", "To increase CPU availability"], answer: 1, explanation: "A DMZ hosts public-facing resources while reducing direct exposure of the internal network." },
  { id: 12, domain: "security-architecture", topic: "iam", difficulty: "easy", question: "Which technology lets users authenticate once and access multiple systems without repeated logins?", options: ["MFA", "SSO", "VPN", "DLP"], answer: 1, explanation: "Single sign-on allows one authentication event to grant access to multiple systems." },
  { id: 13, domain: "security-operations", topic: "incident-response", difficulty: "easy", question: "During incident response, which phase focuses on removing malware and affected artifacts from systems?", options: ["Preparation", "Containment", "Eradication", "Lessons learned"], answer: 2, explanation: "Eradication is when the malicious artifacts and root cause are removed." },
  { id: 14, domain: "security-operations", topic: "monitoring", difficulty: "easy", question: "What is the main purpose of a SIEM?", options: ["To replace backups", "To physically secure server rooms", "To aggregate and analyze security logs", "To issue SSL certificates"], answer: 2, explanation: "A SIEM collects and correlates logs and security events for visibility and detection." },
  { id: 15, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", question: "Which of the following best describes a vulnerability scan?", options: ["A manual exploit campaign against all systems", "An automated assessment for known weaknesses", "A backup validation test", "A full disaster recovery exercise"], answer: 1, explanation: "Vulnerability scans are generally automated checks for known weaknesses and exposures." },
  { id: 16, domain: "security-operations", topic: "resilience", difficulty: "easy", question: "What should happen immediately after containment and eradication are complete?", options: ["Accept the risk", "Recovery", "Policy review only", "Terminate all user accounts"], answer: 1, explanation: "Recovery restores systems and operations to normal while monitoring for recurrence." },
  { id: 17, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "easy", question: "A company decides not to launch a risky public service because the security exposure is too high. Which risk response does this represent?", options: ["Accept", "Transfer", "Avoid", "Mitigate"], answer: 2, explanation: "Avoidance means eliminating the risky activity rather than taking it on." },
  { id: 18, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", question: "Which document typically defines management's high-level intent and security expectations?", options: ["Policy", "Procedure", "Playbook", "Runbook"], answer: 0, explanation: "Policies describe management intent and high-level requirements." },
  { id: 19, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "Which risk treatment shifts the financial burden of a loss to another entity?", options: ["Transfer", "Mitigate", "Accept", "Avoid"], answer: 0, explanation: "Risk transfer shifts the impact through insurance or contractual arrangements." },
  { id: 20, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "easy", question: "What is the primary purpose of data classification?", options: ["To improve internet speed", "To group users by department", "To determine how information should be handled and protected", "To replace encryption"], answer: 2, explanation: "Data classification helps organizations apply appropriate handling and protection based on sensitivity." },
  { id: 21, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", question: "In a public cloud IaaS model, which responsibility typically remains with the customer?", options: ["Physical data center security", "Hypervisor patching", "Guest OS hardening", "Power redundancy"], answer: 2, explanation: "In IaaS, the customer is typically responsible for hardening and maintaining the guest operating systems and workloads." },
  { id: 22, domain: "security-operations", topic: "hardening", difficulty: "medium", question: "Which action best supports system hardening?", options: ["Installing unnecessary services", "Using default passwords", "Removing unused software and services", "Disabling patching"], answer: 2, explanation: "Removing unnecessary software and services reduces attack surface and is a core hardening practice." },
  { id: 23, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "easy", question: "Which type of malware most commonly encrypts files and demands payment?", options: ["Spyware", "Ransomware", "Rootkit", "Logic bomb"], answer: 1, explanation: "Ransomware encrypts or locks access to data and demands payment for recovery." },
  { id: 24, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", question: "Which wireless security option is generally the strongest choice for modern enterprise Wi-Fi?", options: ["WEP", "WPA", "WPA2-TKIP", "WPA3"], answer: 3, explanation: "WPA3 is the strongest modern choice among these options." },
  { id: 25, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "What does implicit deny mean in access control?", options: ["All traffic is allowed by default", "Access is denied unless explicitly permitted", "Only admins are denied", "Deny rules are optional"], answer: 1, explanation: "Implicit deny means the default stance is to deny access unless something explicitly allows it." },
  { id: 26, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", question: "What is the main goal of security awareness training?", options: ["To replace technical controls", "To reduce human-related risk", "To eliminate all incidents", "To automate audits"], answer: 1, explanation: "Awareness training helps reduce the human risk element by teaching safer behavior and recognition of threats." },
  { id: 27, domain: "security-operations", topic: "resilience", difficulty: "hard", question: "A business can tolerate losing up to four hours of data after a disaster. Which metric is this describing?", options: ["RTO", "RPO", "MTTR", "SLA"], answer: 1, explanation: "RPO is the maximum tolerable amount of data loss measured in time." },
  { id: 28, domain: "security-operations", topic: "resilience", difficulty: "hard", question: "A service must be restored within two hours after an outage. Which metric is this describing?", options: ["RTO", "RPO", "MTBF", "ALE"], answer: 0, explanation: "RTO is the target time to restore the service after disruption." },
  { id: 29, domain: "security-architecture", topic: "data-protection", difficulty: "medium", question: "Which method replaces sensitive values with a mapped non-sensitive substitute?", options: ["Hashing", "Tokenization", "Salting", "Masking memory"], answer: 1, explanation: "Tokenization substitutes sensitive data with tokens that map back to the original values." },
  { id: 30, domain: "threats-vulnerabilities-mitigations", topic: "physical-security", difficulty: "easy", question: "A user holds the door open for an unauthorized person who then enters a secure room. What is this called?", options: ["Shoulder surfing", "Tailgating", "Impersonation", "Eliciting"], answer: 1, explanation: "Tailgating is unauthorized entry by following an authorized person into a restricted area." },
  { id: 31, domain: "general-security-concepts", topic: "controls", difficulty: "medium", question: "Which control would be considered compensating?", options: ["A replacement control that provides similar protection when the primary control is not feasible", "A warning banner", "A security camera used only as a deterrent", "An annual training newsletter"], answer: 0, explanation: "Compensating controls are alternate protections used when the preferred control cannot be implemented." },
  { id: 32, domain: "general-security-concepts", topic: "iam", difficulty: "medium", question: "Which factor category does a fingerprint scanner represent?", options: ["Something you know", "Somewhere you are", "Something you have", "Something you are"], answer: 3, explanation: "Biometrics such as fingerprints are something you are." },
  { id: 33, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "medium", question: "An attacker calls the help desk pretending to be an executive and pressures staff to reset a password immediately. This is an example of:", options: ["Pretexting", "Shoulder surfing", "Jamming", "Smishing"], answer: 0, explanation: "Pretexting involves creating a believable story or identity to manipulate a victim." },
  { id: 34, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "hard", question: "Which vulnerability is most directly associated with unsanitized user input being interpreted as commands by a backend database?", options: ["Cross-site scripting", "SQL injection", "Buffer overflow", "Race condition"], answer: 1, explanation: "SQL injection occurs when unsanitized input is passed into database queries." },
  { id: 35, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "medium", question: "Which malware type is specifically designed to hide its presence while maintaining privileged access?", options: ["Worm", "Ransomware", "Rootkit", "Adware"], answer: 2, explanation: "Rootkits are designed to hide and maintain privileged access." },
  { id: 36, domain: "security-architecture", topic: "network-security", difficulty: "medium", question: "What is the primary security benefit of VLANs?", options: ["Increase CPU speed", "Reduce broadcast domains and segment traffic", "Encrypt all traffic automatically", "Replace access control lists"], answer: 1, explanation: "VLANs logically segment network traffic and reduce broadcast scope." },
  { id: 37, domain: "security-architecture", topic: "cryptography", difficulty: "hard", question: "Which cryptographic function is intended to provide integrity verification rather than confidentiality?", options: ["Hashing", "Encryption", "Tokenization", "Steganography"], answer: 0, explanation: "Hashing is commonly used to verify integrity by detecting changes to data." },
  { id: 38, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", question: "Which cloud model gives customers the least responsibility for underlying infrastructure management?", options: ["IaaS", "PaaS", "SaaS", "Colocation"], answer: 2, explanation: "SaaS generally leaves the least infrastructure responsibility to the customer." },
  { id: 39, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", question: "Which feature helps prevent unauthorized devices from joining a wireless network by requiring certificate-based authentication?", options: ["WPS", "802.1X", "MAC flooding", "Port mirroring"], answer: 1, explanation: "802.1X supports strong authentication, commonly with certificates via EAP methods." },
  { id: 40, domain: "security-operations", topic: "monitoring", difficulty: "medium", question: "Which log source would be most useful for identifying repeated failed login attempts against cloud services?", options: ["HVAC logs", "Authentication logs", "Printer status logs", "UPS battery logs"], answer: 1, explanation: "Authentication logs are the primary source for tracking login success and failure patterns." },
  { id: 41, domain: "security-operations", topic: "incident-response", difficulty: "medium", question: "What is the main purpose of lessons learned after an incident?", options: ["To assign blame", "To improve future response and controls", "To eliminate backups", "To skip recovery testing"], answer: 1, explanation: "Lessons learned are meant to improve procedures, controls, and preparedness for future incidents." },
  { id: 42, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", question: "Why is credentialed scanning often more accurate than non-credentialed scanning?", options: ["It uses fewer network packets", "It can inspect systems from the inside with authorized access", "It disables logging", "It automatically patches systems"], answer: 1, explanation: "Credentialed scans can inspect local configuration and patch states more deeply using authorized access." },
  { id: 43, domain: "security-operations", topic: "hardening", difficulty: "medium", question: "Which practice best supports secure configuration management?", options: ["Making undocumented changes directly in production", "Using approved baselines and change control", "Allowing local admins to configure anything", "Disabling audits to improve performance"], answer: 1, explanation: "Secure configuration management relies on baselines, review, and controlled change processes." },
  { id: 44, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "What does annualized loss expectancy estimate?", options: ["The probability of password reuse", "The yearly expected financial loss from a risk", "The mean time to recovery", "The number of incidents per department"], answer: 1, explanation: "ALE estimates the expected yearly financial loss associated with a particular risk." },
  { id: 45, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "medium", question: "Which document is most likely to contain step-by-step instructions for onboarding a new employee securely?", options: ["Policy", "Procedure", "Standard", "Guideline"], answer: 1, explanation: "Procedures contain detailed step-by-step instructions for performing tasks." },
  { id: 46, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "medium", question: "Which control is most directly associated with preventing unauthorized disclosure of data on lost laptops?", options: ["Full-disk encryption", "Load balancing", "Port aggregation", "Network address translation"], answer: 0, explanation: "Full-disk encryption protects stored data if the device is lost or stolen." },
  { id: 47, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", question: "Which metric would best show whether phishing awareness training is improving user behavior?", options: ["Decrease in phishing simulation click rate", "Increase in printer usage", "Lower CPU temperature", "Reduction in cable length"], answer: 0, explanation: "A lower click rate on phishing simulations indicates better user recognition and safer behavior." },
  { id: 48, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "Which principle assumes that no user or device should be inherently trusted just because it is on the internal network?", options: ["Shared responsibility", "Zero trust", "Defense in depth", "Allow by default"], answer: 1, explanation: "Zero trust assumes no implicit trust based solely on location or network position." },
];

export const pbqScenarios: PbqScenario[] = [
  {
    id: 1,
    domain: "security-architecture",
    topic: "network-security",
    title: "Small office network segmentation",
    scenario: "A small business currently has staff laptops, guest Wi-Fi, printers, and an internal file server all on the same flat network. Management wants to reduce risk from lateral movement and keep guest devices away from business systems.",
    prompt: "Describe how you would redesign the network at a high level.",
    tasks: [
      "Separate guest devices from internal business systems",
      "Restrict printer access to only authorized internal users",
      "Reduce the blast radius of a compromised endpoint",
    ],
    solution: [
      "Create separate VLANs or segmented subnets for guests, user workstations, printers, and servers.",
      "Place guest Wi-Fi on its own isolated segment with internet-only access.",
      "Use firewall or ACL rules between segments to limit traffic to only what is needed.",
      "Restrict access to the file server to authorized internal workstation segments only.",
    ],
  },
  {
    id: 2,
    domain: "security-operations",
    topic: "incident-response",
    title: "Ransomware incident response",
    scenario: "Several users report they can no longer open files on a shared drive, and ransom notes are appearing in multiple folders. You suspect ransomware is spreading through the environment.",
    prompt: "List the immediate priorities for the first phase of response.",
    tasks: [
      "Limit spread",
      "Preserve evidence",
      "Prepare for recovery",
    ],
    solution: [
      "Contain affected systems by isolating infected hosts from the network.",
      "Disable compromised accounts or suspicious privileged sessions if needed.",
      "Preserve logs, alerts, and forensic evidence before wiping systems.",
      "Identify unaffected backups and verify their integrity before restoration.",
    ],
  },
  {
    id: 3,
    domain: "security-program-management-and-oversight",
    topic: "data-protection",
    title: "Laptop protection policy",
    scenario: "A company has had several traveling employees lose laptops in airports and hotels. Leadership wants a policy and technical response that reduces the chance of data exposure.",
    prompt: "Recommend the most important controls.",
    tasks: [
      "Protect data at rest",
      "Reduce unauthorized access risk",
      "Support recovery or response",
    ],
    solution: [
      "Require full-disk encryption on all company laptops.",
      "Enforce MFA and strong screen lock settings.",
      "Use mobile device management to support remote lock or wipe.",
      "Classify sensitive data and minimize local storage when possible.",
    ],
  },
];

export function getDomainLabel(domainId: string) {
  return secPlusDomains.find((domain) => domain.id === domainId)?.name ?? "All Domains";
}

export function shuffleArray<T>(items: T[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getTopics(domainId?: string) {
  const source = domainId && domainId !== "all"
    ? practiceQuestions.filter((question) => question.domain === domainId)
    : practiceQuestions;

  return Array.from(new Set(source.map((item) => item.topic))).sort();
}
