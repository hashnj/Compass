export function extractSkillsFromText(text) {
  const skillsList = [
    // Programming Languages
    'python', 'javascript', 'node.js', 'react', 'sql', 'html', 'css',
    'java', 'typescript', 'c++', 'c#', 'ruby', 'php', 'kotlin', 'swift', 
    'r', 'go', 'perl', 'scala', 'rust', 'matlab',
  
    // Front-End Frameworks
    'angular', 'vue.js', 'svelte', 'bootstrap', 'tailwindcss', 'jquery', 'next.js',
  
    // Back-End Frameworks
    'express.js', 'django', 'flask', 'spring boot', 'laravel', 'ruby on rails', 'asp.net',
  
    // Databases
    'mongodb', 'mysql', 'postgresql', 'firebase', 'redis', 'cassandra', 
    'sqlite', 'oracle', 'mariadb', 'neo4j', 'dynamodb', 
  
    // Cloud and DevOps
    'docker', 'aws', 'azure', 'google cloud platform', 'kubernetes', 
    'terraform', 'ansible', 'jenkins', 'circleci', 'github actions', 'heroku',
    'travis ci',
  
    // Data Analysis & Machine Learning
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'keras', 'pytorch',
    'matplotlib', 'seaborn', 'nlp', 'opencv', 'spark', 'hadoop', 'power bi',
    'tableau', 'bigquery', 'databricks',
  
    // Mobile Development
    'flutter', 'react native', 'swiftui', 'ionic', 'xamarin',
  
    // Testing & QA
    'jest', 'mocha', 'chai', 'cypress', 'selenium', 'puppeteer', 'karma',
  
    // Version Control
    'git', 'svn', 'mercurial',
  
    // Other Technical Skills
    'graphql', 'rest api', 'websocket', 'json', 'xml', 'swagger', 'postman',
    'vim', 'bash', 'zsh', 'powershell', 'linux', 'unix',
  
    // Security
    'cybersecurity', 'ethical hacking', 'penetration testing', 'ssl/tls',
    'owasp', 'cloud security', 'firewall', 'encryption',
  
    // Miscellaneous
    'wordpress', 'shopify', 'wix', 'seo', 'digital marketing', 
    'unity', 'unreal engine', 'blender', 'autocad', 'sap', 'salesforce',
    'crm', 'erp', 'iot', 'blockchain', 'solidity', 'nft', 'metaverse',
  
    // Soft Skills
    'communication', 'teamwork', 'project management', 'agile', 'scrum',
    'kanban', 'time management', 'problem-solving', 'critical thinking',
    'leadership', 'adaptability'
  ];
  
  return skillsList.filter(skill => text.includes(skill.toLowerCase()));
}
