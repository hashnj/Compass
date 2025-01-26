export function extractSkillsFromText(text) {
  const skillsList = [
    'python', 'javascript', 'node.js', 'react', 'sql', 'html', 'css', 
    'docker', 'aws', 'git', 'mongodb', 'java', 'typescript', 'angular'
  ];
  return skillsList.filter(skill => text.includes(skill.toLowerCase()));
}
