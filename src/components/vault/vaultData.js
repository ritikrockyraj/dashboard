// Scan handbooks folder dynamically
const handbookFiles = import.meta.glob([
  '/handbook/**/*.md',
  '/handbooks/**/*.md'
], { query: '?raw', eager: true, import: 'default' });

export const extractProjectData = (path, rawText) => {
  // Title extraction: first heading
  let title = '';
  const titleMatch = rawText.match(/^#\s*(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].replace(/[🔐🏦🧠💻📊🛠️⚙️]/g, '').trim();
    const separatorIdx = title.indexOf(':');
    const dashIdx = title.indexOf('—');
    const cutIdx = separatorIdx !== -1 ? separatorIdx : (dashIdx !== -1 ? dashIdx : -1);
    if (cutIdx !== -1) {
      title = title.substring(0, cutIdx).trim();
    }
  } else {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    title = fileName
      .replace(/(_HANDBOOK)?\.md$/, '')
      .replace(/^\d+_/, '')
      .replace(/_/g, ' ');
  }

  // Repo URL extraction
  let repoUrl = '';
  const repoMatch = rawText.match(/https:\/\/github\.com\/[a-zA-Z0-9_\-\/]+/);
  if (repoMatch) {
    repoUrl = repoMatch[0];
  }

  // Tech stack auto-detection
  const knownTech = [
    'PyTorch', 'Python', 'React', 'FastAPI', 'Flask', 'Docker', 'MLflow', 
    'CUDA', 'Scikit-learn', 'OpenCV', 'Deep Learning', 'Vite', 'Tailwind CSS', 
    'Transformers', 'Node.js', 'Express', 'JavaScript', 'MongoDB', 'PostgreSQL'
  ];
  const techStack = [];
  const lowerText = rawText.toLowerCase();
  knownTech.forEach(tech => {
    if (lowerText.includes(tech.toLowerCase())) {
      techStack.push(tech);
    }
  });

  const id = path.split('/').pop().replace(/\.md$/, '').toLowerCase();

  return {
    id,
    title,
    category: 'active',
    techStack: techStack.slice(0, 5),
    repoUrl,
    gitCommands: [
      { label: 'git status', cmd: 'git status' },
      { label: 'push changes', cmd: 'git add . && git commit -m "feat: updated handbook notes" && git push origin main' }
    ],
    architectureNotes: '',
    interviewQA: '',
    readiness: { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 },
    mockFeedbackLog: '',
    reviewLog: []
  };
};

export const getSeedProjects = () => {
  const list = [];

  // Parse detected files
  Object.entries(handbookFiles).forEach(([path, content]) => {
    if (content) {
      list.push(extractProjectData(path, content));
    }
  });

  // Ensure we have at least 6 active projects
  const activeCountNeeded = 6;
  let activeIndex = list.filter(p => p.category === 'active').length + 1;
  while (list.filter(p => p.category === 'active').length < activeCountNeeded) {
    list.push({
      id: `active-placeholder-${activeIndex}`,
      title: `Active Project Placeholder ${activeIndex}`,
      category: 'active',
      techStack: [],
      repoUrl: '',
      gitCommands: [
        { label: 'git status', cmd: 'git status' },
        { label: 'push changes', cmd: 'git add . && git commit -m "feat: updated handbook notes" && git push origin main' }
      ],
      architectureNotes: '',
      interviewQA: '',
      readiness: { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 },
      mockFeedbackLog: '',
      reviewLog: []
    });
    activeIndex++;
  }

  // Pre-populate 2 target cards as blank placeholders labeled "Target / Future Build"
  for (let i = 1; i <= 2; i++) {
    list.push({
      id: `target-placeholder-${i}`,
      title: 'Target / Future Build',
      category: 'target',
      techStack: [],
      repoUrl: '',
      gitCommands: [],
      architectureNotes: '',
      interviewQA: '',
      readiness: { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 },
      mockFeedbackLog: '',
      reviewLog: []
    });
  }

  return list;
};

// Also export the raw handbooks mapping so they can be read dynamically by components
export const rawHandbooksMap = Object.entries(handbookFiles).reduce((acc, [path, content]) => {
  const id = path.split('/').pop().replace(/\.md$/, '').toLowerCase();
  acc[id] = content;
  return acc;
}, {});
