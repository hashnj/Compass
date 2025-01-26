export function calculateMatchRate(userSkills, jobSkills) {
  const matchingSkills = jobSkills.filter(jobSkill =>
    userSkills.some(userSkill => userSkill.toLowerCase() === jobSkill.toLowerCase())
  );
  return Math.round((matchingSkills.length / jobSkills.length) * 100);
}
