/**
 * Modern Template
 * Contemporary design with accent colors and modern typography
 * Side column layout for contact info and skills
 */
export const modernTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{fullName}} - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1a1a2e;
      background: white;
    }
    
    .container {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
    }
    
    .sidebar {
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 25px;
    }
    
    .main {
      padding: 40px;
    }
    
    .name {
      font-size: 20pt;
      font-weight: 700;
      margin-bottom: 5px;
      letter-spacing: -0.5px;
    }
    
    .title {
      font-size: 10pt;
      font-weight: 300;
      opacity: 0.9;
      margin-bottom: 25px;
    }
    
    .sidebar-section {
      margin-bottom: 30px;
    }
    
    .sidebar-title {
      font-size: 9pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      opacity: 0.8;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 5px;
    }
    
    .contact-item {
      font-size: 9pt;
      margin-bottom: 12px;
      word-break: break-all;
    }
    
    .contact-label {
      font-weight: 600;
      display: block;
      opacity: 0.7;
      font-size: 8pt;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    
    .skill-category {
      margin-bottom: 20px;
    }
    
    .skill-category-name {
      font-size: 9pt;
      font-weight: 500;
      margin-bottom: 8px;
      opacity: 0.9;
    }
    
    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .skill-pill {
      background: rgba(255,255,255,0.15);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 8.5pt;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f5;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
    
    .summary {
      color: #4a4a5a;
      line-height: 1.7;
      font-size: 10pt;
    }
    
    .experience-item, .education-item, .project-item {
      margin-bottom: 25px;
      position: relative;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    
    .job-title, .degree {
      font-size: 11pt;
      font-weight: 600;
      color: #1a1a2e;
    }
    
    .company, .institution {
      font-size: 10.5pt;
      color: #667eea;
      font-weight: 500;
    }
    
    .meta {
      font-size: 9pt;
      color: #888;
      margin: 2px 0 10px 0;
    }
    
    ul {
      margin-left: 18px;
      margin-top: 10px;
    }
    
    li {
      margin-bottom: 6px;
      color: #4a4a5a;
      line-height: 1.5;
    }
    
    .project-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 11pt;
    }
    
    .project-link {
      color: #667eea;
      text-decoration: none;
      font-size: 9pt;
      margin-left: 8px;
    }
    
    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    
    .tech-badge {
      background: #f0f0f5;
      color: #667eea;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 500;
    }
    
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .cert-card {
      background: #f8f8fc;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .cert-name {
      font-weight: 600;
      font-size: 10pt;
      color: #1a1a2e;
      margin-bottom: 4px;
    }
    
    .cert-issuer {
      color: #667eea;
      font-size: 9pt;
      font-weight: 500;
    }
    
    .cert-date {
      color: #888;
      font-size: 8.5pt;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h1 class="name">{{fullName}}</h1>
      {{#if targetTitle}}
        <p class="title">{{targetTitle}}</p>
      {{else}}
        <p class="title">Professional Resume</p>
      {{/if}}
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Contact</h3>
        <div class="contact-item">
          <span class="contact-label">Email</span>
          {{email}}
        </div>
        {{#if phone}}
        <div class="contact-item">
          <span class="contact-label">Phone</span>
          {{phone}}
        </div>
        {{/if}}
        {{#if location}}
        <div class="contact-item">
          <span class="contact-label">Location</span>
          {{location}}
        </div>
        {{/if}}
        {{#if linkedin}}
        <div class="contact-item">
          <span class="contact-label">LinkedIn</span>
          {{linkedin}}
        </div>
        {{/if}}
        {{#if github}}
        <div class="contact-item">
          <span class="contact-label">GitHub</span>
          {{github}}
        </div>
        {{/if}}
        {{#if website}}
        <div class="contact-item">
          <span class="contact-label">Website</span>
          {{website}}
        </div>
        {{/if}}
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Skills</h3>
        {{#hasItems skills.technical}}
        <div class="skill-category">
          <div class="skill-category-name">Technical</div>
          <div class="skill-pills">
            {{#each skills.technical}}
            <span class="skill-pill">{{this}}</span>
            {{#unless @last}} {{/unless}}
            {{/each}}
          </div>
        </div>
        {{/hasItems}}
        
        {{#hasItems skills.soft}}
        <div class="skill-category">
          <div class="skill-category-name">Soft Skills</div>
          <div class="skill-pills">
            {{#each skills.soft}}
            <span class="skill-pill">{{this}}</span>
            {{/each}}
          </div>
        </div>
        {{/hasItems}}

        {{#hasItems skills.languages}}
        <div class="skill-category">
          <div class="skill-category-name">Languages</div>
          <div class="skill-pills">
            {{#each skills.languages}}
            <span class="skill-pill">{{this}}</span>
            {{/each}}
          </div>
        </div>
        {{/hasItems}}
      </div>
    </aside>
    
    <main class="main">
      {{#if summary}}
      <section class="section">
        <h2 class="section-title">About Me</h2>
        <p class="summary">{{summary}}</p>
      </section>
      {{/if}}
      
      {{#hasItems experiences}}
      <section class="section">
        <h2 class="section-title">Experience</h2>
        {{#each experiences}}
        <div class="experience-item">
          <div class="item-header">
            <div class="job-title">{{position}}</div>
            <div class="meta">
              {{formatDate startDate}} - {{#if isCurrent}}Present{{else}}{{formatDate endDate}}{{/if}}
            </div>
          </div>
          <div class="company">{{company}}{{#if location}} · {{location}}{{/if}}</div>
          {{#hasItems responsibilities}}
          <ul>
            {{#each responsibilities}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
          {{/hasItems}}
          {{#hasItems achievements}}
          <ul>
            {{#each achievements}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
          {{/hasItems}}
        </div>
        {{/each}}
      </section>
      {{/hasItems}}
      
      {{#hasItems education}}
      <section class="section">
        <h2 class="section-title">Education</h2>
        {{#each education}}
        <div class="education-item">
          <div class="item-header">
            <div class="degree">{{degree}}</div>
            <div class="meta">
              {{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}
            </div>
          </div>
          <div class="institution">{{institution}}{{#if location}} · {{location}}{{/if}}</div>
          {{#if gpa}}<div class="meta" style="margin-top: 5px;">GPA: {{gpa}}</div>{{/if}}
          {{#if honors}}<div class="meta">{{honors}}</div>{{/if}}
        </div>
        {{/each}}
      </section>
      {{/hasItems}}
      
      {{#hasItems projects}}
      <section class="section">
        <h2 class="section-title">Projects</h2>
        {{#each projects}}
        <div class="project-item">
          <div>
            <span class="project-name">{{name}}</span>
            {{#if link}}<a href="{{link}}" class="project-link">View Project</a>{{/if}}
          </div>
          <p style="margin: 8px 0; color: #4a4a5a;">{{description}}</p>
          <div class="tech-badges">
            {{#each technologies}}
            <span class="tech-badge">{{this}}</span>
            {{/each}}
          </div>
          {{#hasItems highlights}}
          <ul>
            {{#each highlights}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
          {{/hasItems}}
        </div>
        {{/each}}
      </section>
      {{/hasItems}}
      
      {{#hasItems certifications}}
      <section class="section">
        <h2 class="section-title">Certifications</h2>
        <div class="cert-grid">
          {{#each certifications}}
          <div class="cert-card">
            <div class="cert-name">{{name}}</div>
            <div class="cert-issuer">{{issuer}}</div>
            <div class="cert-date">{{formatDate issueDate}}</div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/hasItems}}
    </main>
  </div>
</body>
</html>
`;
